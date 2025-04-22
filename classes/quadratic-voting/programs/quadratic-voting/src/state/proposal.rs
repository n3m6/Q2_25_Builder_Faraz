pub use anchor_lang::prelude::*;

#[account]
#[derive(Debug, InitSpace)]
pub struct Proposal {
    pub yes_vote_count: u64,
    pub no_vote_count: u64,

    pub authority: Pubkey,

    #[max_len(30)]
    pub metadata: String,

    pub create_key: Pubkey, // random-hash

    pub bump: u8,
}
