use raw::{Comparator, ComparisonOp, RawLogic};
use serde::{de, Deserialize, Deserializer};
use std::error::Error;
use std::str::FromStr;

mod raw;

#[derive(PartialEq, Eq, Debug, Clone)]
pub enum Condition {
    And(Box<Condition>, Box<Condition>),
    Or(Box<Condition>, Box<Condition>),
    LessThan(String, u8),
    GreaterThan(String, u8),
}

impl Condition {
    fn from_raw(raw: RawLogic) -> Result<Self, Box<dyn Error>> {
        use ComparisonOp::*;
        use RawLogic::*;

        match raw {
            Ident(s) => Ok(Self::GreaterThan(s, 0)),
            And(left, right) => Ok(Self::And(
                Box::new(Self::from_raw(*left)?),
                Box::new(Self::from_raw(*right)?),
            )),
            Or(left, right) => Ok(Self::Or(
                Box::new(Self::from_raw(*left)?),
                Box::new(Self::from_raw(*right)?),
            )),
            Comparison(left, op, right) => {
                if let (Ident(left), Num(right)) = (*left, *right) {
                    let right = match right {
                        Comparator::Int(n) => n,
                        Comparator::NotchCost { .. } => 0, // FIXME: Canonicalize this here?
                    };
                    match op {
                        Less => Ok(Self::LessThan(left, right)),
                        LessOrEqual => Ok(Self::LessThan(left, right + 1)),
                        Equal if right == 0 => Ok(Self::LessThan(left, 1)),
                        Equal => Ok(Self::And(
                            Box::new(Self::LessThan(left.clone(), right + 1)),
                            Box::new(Self::GreaterThan(left, right - 1)),
                        )),
                        GreaterOrEqual => Ok(Self::GreaterThan(left, right - 1)),
                        Greater => Ok(Self::GreaterThan(left, right)),
                    }
                } else {
                    Err("found invalid comparison".into())
                }
            }
            Num(_) => Err("found number used in boolean context".into()),
        }
    }
}

impl FromStr for Condition {
    type Err = Box<dyn Error>;

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        Self::from_raw(RawLogic::from_str(input)?)
    }
}

impl<'de> Deserialize<'de> for Condition {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        FromStr::from_str(&s).map_err(de::Error::custom)
    }
}

#[test]
fn ident_becomes_gt_0() {
    assert_eq!(
        convert(RawLogic::ident("a")),
        Condition::GreaterThan("a".into(), 0),
    )
}

#[test]
fn comparison_conversion() {
    assert_eq!(
        convert(RawLogic::comparison(
            RawLogic::ident("a"),
            ComparisonOp::Less,
            RawLogic::num(1)
        )),
        Condition::LessThan("a".into(), 1),
    );
    assert_eq!(
        convert(RawLogic::comparison(
            RawLogic::ident("b"),
            ComparisonOp::LessOrEqual,
            RawLogic::num(2)
        )),
        Condition::LessThan("b".into(), 3),
    );
    assert_eq!(
        convert(RawLogic::comparison(
            RawLogic::ident("c"),
            ComparisonOp::Equal,
            RawLogic::num(2)
        )),
        Condition::And(
            Box::new(Condition::LessThan("c".into(), 3)),
            Box::new(Condition::GreaterThan("c".into(), 1)),
        ),
    );
    assert_eq!(
        convert(RawLogic::comparison(
            RawLogic::ident("d"),
            ComparisonOp::Equal,
            RawLogic::num(0)
        )),
        Condition::LessThan("d".into(), 1),
    );
}

#[cfg(test)]
fn convert(raw: RawLogic) -> Condition {
    Condition::from_raw(raw).unwrap()
}
