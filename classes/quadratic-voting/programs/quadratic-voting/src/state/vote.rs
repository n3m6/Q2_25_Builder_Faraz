pub use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub authority: Pubkey,
    // 0 -> Yes
    // 1 -> No
    pub vote_type: u8,

    pub vote_credits: u64, // if quadratic funding -> total_tokens used for voting

    pub bump: u8,
}
