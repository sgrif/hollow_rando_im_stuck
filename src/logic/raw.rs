use std::error::Error;
use std::fmt::Display;
use std::str::FromStr;

#[derive(PartialEq, Eq, Debug, Clone, pest_derive::Parser)]
#[grammar = "logic/grammar.pest"]
enum RawLogic {
    Ident(String),
    Num(u8),
    And(Box<RawLogic>, Box<RawLogic>),
    Or(Box<RawLogic>, Box<RawLogic>),
    Comparison(Box<RawLogic>, ComparisonOp, Box<RawLogic>),
}

impl RawLogic {
    fn ident(ident: impl Display) -> Self {
        RawLogic::Ident(ident.to_string())
    }

    fn and(left: Self, right: Self) -> Self {
        RawLogic::And(Box::new(left), Box::new(right))
    }

    fn or(left: Self, right: Self) -> Self {
        RawLogic::Or(Box::new(left), Box::new(right))
    }

    fn comparison(left: Self, op: ComparisonOp, right: Self) -> Self {
        RawLogic::Comparison(Box::new(left), op, Box::new(right))
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
                Rule::num => {
                    let num = u8::from_str(pair.as_str())?;
                    Ok(RawLogic::Num(num))
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
enum ComparisonOp {
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

#[test]
fn parsing_single_ident() {
    assert_eq!(parse("ANY"), RawLogic::ident("ANY"),);
    assert_eq!(
        parse("Room_shop[left1]"),
        RawLogic::ident("Room_shop[left1]"),
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
            RawLogic::Num(1)
        ),
    );
    assert_eq!(
        parse("a + b <= 2"),
        RawLogic::and(
            RawLogic::ident("a"),
            RawLogic::comparison(
                RawLogic::ident("b"),
                ComparisonOp::LessOrEqual,
                RawLogic::Num(2),
            ),
        ),
    );
    assert_eq!(
        parse("foo's<4"),
        RawLogic::comparison(
            RawLogic::ident("foo's"),
            ComparisonOp::Less,
            RawLogic::Num(4)
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
