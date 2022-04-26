use std::error::Error;
use std::fmt::Display;
use std::str::FromStr;

#[derive(PartialEq, Eq, Debug, Clone, pest_derive::Parser)]
#[grammar = "logic/grammar.pest"]
pub(super) enum RawLogic {
    Ident(String),
    Num(Comparator),
    And(Box<RawLogic>, Box<RawLogic>),
    Or(Box<RawLogic>, Box<RawLogic>),
    Comparison(Box<RawLogic>, ComparisonOp, Box<RawLogic>),
}

impl RawLogic {
    pub(super) fn ident(ident: impl Display) -> Self {
        RawLogic::Ident(ident.to_string())
    }

    pub(super) fn and(left: Self, right: Self) -> Self {
        RawLogic::And(Box::new(left), Box::new(right))
    }

    pub(super) fn or(left: Self, right: Self) -> Self {
        RawLogic::Or(Box::new(left), Box::new(right))
    }

    pub(super) fn comparison(left: Self, op: ComparisonOp, right: Self) -> Self {
        RawLogic::Comparison(Box::new(left), op, Box::new(right))
    }

    pub(super) fn num(n: impl Into<Comparator>) -> Self {
        RawLogic::Num(n.into())
    }
}

impl FromStr for RawLogic {
    type Err = Box<dyn Error>;

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        use pest::iterators::{Pair, Pairs};
        use pest::prec_climber::*;
        use pest::Parser;

        fn parse(pairs: Pairs<Rule>) -> Result<RawLogic, Box<dyn Error>> {
            lazy_static::lazy_static! {
                static ref PREC_CLIMBER: PrecClimber<Rule> = PrecClimber::new(vec![
                    Operator::new(Rule::or, Assoc::Left),
                    Operator::new(Rule::and, Assoc::Left),
                    Operator::new(Rule::comparison_operator, Assoc::Left),
                ]);
            }

            let parse_primary = |pair: Pair<Rule>| match pair.as_rule() {
                Rule::ident | Rule::transition => Ok(RawLogic::ident(pair.as_str())),
                Rule::int => {
                    let num = u8::from_str(pair.as_str())?;
                    Ok(RawLogic::num(num))
                }
                Rule::notch_cost => {
                    let ints = pair
                        .into_inner()
                        .map(|i| u8::from_str(i.as_str()))
                        .collect::<Result<Vec<_>, _>>()?;
                    Ok(RawLogic::num(Comparator::NotchCost { charm_ids: ints }))
                }
                Rule::paren_expression => parse(pair.into_inner()),
                _ => Err("expected ident or number".into()),
            };

            let parse_infix = |left, operator: Pair<Rule>, right| match operator.as_rule() {
                Rule::and => Ok(RawLogic::and(left?, right?)),
                Rule::or => Ok(RawLogic::or(left?, right?)),
                Rule::comparison_operator => Ok(RawLogic::comparison(
                    left?,
                    ComparisonOp::from_str(operator.as_str())?,
                    right?,
                )),
                _ => Err("expected infix operator".into()),
            };

            PREC_CLIMBER.climb(pairs, parse_primary, parse_infix)
        }
        parse(RawLogic::parse(Rule::logic, input)?)
    }
}

#[derive(PartialEq, Eq, Debug, Clone, Copy)]
pub(super) enum ComparisonOp {
    Less,
    LessOrEqual,
    Equal,
    GreaterOrEqual,
    Greater,
}

impl FromStr for ComparisonOp {
    type Err = Box<dyn Error>;

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        match input {
            "<" => Ok(ComparisonOp::Less),
            "<=" => Ok(ComparisonOp::LessOrEqual),
            "=" => Ok(ComparisonOp::Equal),
            ">=" => Ok(ComparisonOp::GreaterOrEqual),
            ">" => Ok(ComparisonOp::Greater),
            _ => Err(format!("Invalid comparison op: {}", input).into()),
        }
    }
}

#[derive(PartialEq, Eq, Debug, Clone)]
pub(super) enum Comparator {
    Int(u8),
    NotchCost { charm_ids: Vec<u8> },
}

impl From<u8> for Comparator {
    fn from(n: u8) -> Self {
        Self::Int(n)
    }
}

#[test]
fn parsing_single_ident() {
    assert_eq!(parse("ANY"), RawLogic::ident("ANY"),);
    assert_eq!(
        parse("Room_shop[left1]"),
        RawLogic::ident("Room_shop[left1]"),
    );
    assert_eq!(
        parse("$StartLocation[West Waterways]"),
        RawLogic::ident("$StartLocation[West Waterways]"),
    );
}

#[test]
fn parsing_and() {
    assert_eq!(
        parse("Room_shop[left1] + Rescued_Sly"),
        RawLogic::and(
            RawLogic::ident("Room_shop[left1]"),
            RawLogic::ident("Rescued_Sly")
        ),
    );
    assert_eq!(
        parse("Ruins2_Watcher_Room[bot1] + DREAMNAIL"),
        RawLogic::and(
            RawLogic::ident("Ruins2_Watcher_Room[bot1]"),
            RawLogic::ident("DREAMNAIL")
        ),
    );
    assert_eq!(
        parse("Room_shop[left1] + Rescued_Sly + SHOPKEY"),
        RawLogic::and(
            RawLogic::and(
                RawLogic::ident("Room_shop[left1]"),
                RawLogic::ident("Rescued_Sly")
            ),
            RawLogic::ident("SHOPKEY")
        ),
    );
}

#[test]
#[should_panic]
fn parsing_incomplete_branch_errors() {
    parse("Room_shop[left1] +");
}

#[test]
fn parsing_or() {
    assert_eq!(
        parse("a | b"),
        RawLogic::or(RawLogic::ident("a"), RawLogic::ident("b")),
    );
    assert_eq!(
        parse("c | d | e"),
        RawLogic::or(
            RawLogic::or(RawLogic::ident("c"), RawLogic::ident("d")),
            RawLogic::ident("e")
        ),
    );
}

#[test]
fn and_or_precedence() {
    assert_eq!(
        parse("a + b | c + d"),
        RawLogic::or(
            RawLogic::and(RawLogic::ident("a"), RawLogic::ident("b")),
            RawLogic::and(RawLogic::ident("c"), RawLogic::ident("d")),
        )
    );
}

#[test]
fn comparison() {
    assert_eq!(
        parse("a > 1"),
        RawLogic::comparison(
            RawLogic::ident("a"),
            ComparisonOp::Greater,
            RawLogic::num(1)
        ),
    );
    assert_eq!(
        parse("a + b <= 2"),
        RawLogic::and(
            RawLogic::ident("a"),
            RawLogic::comparison(
                RawLogic::ident("b"),
                ComparisonOp::LessOrEqual,
                RawLogic::num(2),
            ),
        ),
    );
    assert_eq!(
        parse("foo's<4"),
        RawLogic::comparison(
            RawLogic::ident("foo's"),
            ComparisonOp::Less,
            RawLogic::num(4)
        ),
    );
}

#[test]
fn notch_cost_comparsion() {
    assert_eq!(
        parse("NOTCHES>$NotchCost[31,37]"),
        RawLogic::comparison(
            RawLogic::ident("NOTCHES"),
            ComparisonOp::Greater,
            RawLogic::num(Comparator::NotchCost {
                charm_ids: vec![31, 37]
            }),
        ),
    );
}

#[test]
#[should_panic]
fn bare_num_fails_to_parse() {
    parse("1");
}

#[test]
#[should_panic]
fn num_in_and_fails_to_parse() {
    parse("a + 1");
}

#[test]
#[should_panic]
fn num_in_or_fails_to_parse() {
    parse("a | 1");
}

#[test]
#[should_panic]
fn comparison_op_requires_num() {
    parse("a > b");
}

#[test]
fn parens() {
    assert_eq!(
        parse("(a | b) + c"),
        RawLogic::and(
            RawLogic::or(RawLogic::ident("a"), RawLogic::ident("b")),
            RawLogic::ident("c")
        )
    );
}

#[cfg(test)]
#[track_caller]
fn parse(s: &str) -> RawLogic {
    RawLogic::from_str(s).unwrap_or_else(|e| panic!("{}", e))
}
