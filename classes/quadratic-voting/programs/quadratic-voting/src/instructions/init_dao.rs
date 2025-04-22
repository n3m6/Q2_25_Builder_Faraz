use anchor_lang::prelude::*;

pub use crate::state::Dao;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitDao<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
      init,
      payer = creator,
      space = Dao::INIT_SPACE,
      seeds = [b"dao", creator.key().as_ref(), name.as_bytes()],
      bump,
    )]
    pub dao_account: Account<'info, Dao>,

    pub system_program: Program<'info, Ssytem>,
}

pub fn init_dao(ctx: Context<InitDao>, name: String) -> Result<()> {
    let dao_account = &mut ctx.accounts.dao_account;

    dao_account.set_inner(inner);

    Ok(())
}
