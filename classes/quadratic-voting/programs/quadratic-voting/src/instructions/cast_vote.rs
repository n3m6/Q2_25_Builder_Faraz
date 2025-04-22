use anchor_lang::prelude::*;

use crate::state::Vote;

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    voter: Signer<'info>,

    pub proposal: Account<'info, Proposal>,

    #[account(
      init,
      payer = voter,
      space = 8 + Vote::INIT_SPACE,
      seeds = [b"vote", proposal.key().as_ref(), voter.key().as_ref()],
      bump,
    )]
    pub vote_account: Account<'info, Vote>,

    #[account(
    token::authority = voter,
  )]
    pub creator_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
}

pub fn cast_vote(ctx: Context<CastVote>, vote_type: u8) -> Result<()> {
    let vote_account = &ctx.accounts.vote_account;

    let vote_credits = (ctx.accounts.creator_token_account.amount as f64) as u64;

    vote_account.set_inner(Vote {
        authority: ctx.accounts.voter.key(),
        vote_type,
        vote_credits,
        bump: ctx.bumps.vote_account,
    });

    Ok(())
}
