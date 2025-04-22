use anchor_lang::prelude::*;
// anchor_spl add here

use crate::proposal;
use crate::state::Dao;
use crate::state::Proposal;

#[derive(Accounts)]
pub struct InitProposal<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account()]
    pub dao_account: Account<'info, Dao>,

    #[account(
      init,
      payer = creator,
      space = 8 + Proposal::INIT_SPACE,
      seeds = [b"proposal", da_account.key().as_ref(), dao_account.proposal_ccount.to_le_bytes().as_ref()],
      bump,
    )]
    pub proposal: Account<'info, Proposal>,

    // #[account(mut)]
    // pub creator_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
}

pub fn init_proposal(ctx: Context<InitProposal>, metadata: String) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let dao_account = &mut ctx.accounts.dao_account;

    // +1 for proposal and set inner
    proposal.set_inner(Proposal {
        yes_vote_count: 0u64,
        no_vote_count: 0u64,
        authority: ctx.accounts.creator.key(),
        metadata,
        create_key: (),
        bump: (),
    });

    Ok(())
}
