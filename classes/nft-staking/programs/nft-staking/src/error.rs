use anchor_lang::prelude::*;

#[error_code]
pub enum StakeError {
    #[msg("Max stake reached")]
    MaxStakeReached,

    #[msg("Freeze period required")]
    FreezePeriodNotPassed,
}
