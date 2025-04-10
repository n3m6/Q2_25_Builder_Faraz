use anchor_lang::prelude::{declare_id, program, Accounts, Context};
pub mod instructions;
pub mod states;

use crate::instructions::Make;

declare_id!("6NgAKLRABzb1KthviRvPtWgCWaD4bCbJCYuuHzYMwZii");

#[program]
pub mod escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, deposit: u64, receive: u64) -> Result<()> {
        ctx.accounts.deposit(deposit)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
