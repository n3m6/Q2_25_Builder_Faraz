use anchor_lang::prelude::*;

#[account]
#[derive(Debug, InitSpace)]
pub struct Dao {
    #[max_len(30)]
    pub name: String,
    pub authority: Pubkey,
    pub bump: u8,
    pub proposal_ccount: u64,
}
