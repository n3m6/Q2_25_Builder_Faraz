use anchor_lang::{prelude::*, solana_program::system_program, system_program::Transfer, transfer};
use anchor_spl::{token::TokenAccount, token_interface::{Mint, TokenInterface}};

use crate::state::{Listing, Marketplace};
use crate::instruction::Initialize;


#[derive(Accounts)]
pub struct Purchase<'info> {
  #[account(mut)]
  pub taker: Signer<'info>,

  #[account(mut)]
  pub maker: SystemAccount<'info>,

  #[account(
    seeds = [b"marketplace", name.as_a_str().as_bytes()],
    bump = marketplace.bump,
)]
  pub marketplace: Account<'info, Marketplace>,

  pub maker_mint: InterfaceAccount<'info, Mint>,

  #[account(
  init_if_needed,
  payer = taker,
  associated_token::mint = maker_mint,
  associated_token::authority = taker,
)]
  pub taker_ata: InterfaceAccount<'info, TokenAccount>,

  #[account(
    init_if_needed,
    payer = taker,
    associated_token::mint = reward_mint,
    associated_token::authority = taker,
  )]
  pub taker_rewards_ata: InterfaceAccount<'info, TokenAccount>,

  #[account(
  mut,
  associated_token::mint = maker_mint,
  associated_token::authority = listing,
)]
  pub vault: InterfaceAccount<'info, TokenAccount>,

  #[account(
    mut,
  seeds = [b"", marketplace.key().as_ref(), maker_mint.key().as_ref() ],
  bump = listing.bump,
    close = maker,
)]
  pub listing: Account<'info, Listing>,

pub collection_mint: InterfaceAccount<'info, Mint>,

#[account(
  seeds = [b"treasury", marketplace.key().as_ref()],
  bump,
)]
pub treasury: SystemAccount<'info>,

#[account(
  mut,
  seeds = [b"rewards", marketplace.key().as_ref()],
  bump = marketplace.rewards_bump, 
  mint::decimals = 6,
  mint::authority = marketplace,
)]
pub reward_mint: InterfaceAccount<'info, Mint>,

  pub system_program: Program<'info, System>,
  pub token_program: Interface<'info, TokenInterface>,
  pub associated_token_progra: Program<'info, AssociatedToken>,
  pub metadata_program: Program<'info, Metadata>,
}


impl<'info> Purchase<'info> {
  pub fn send_sol(&mut self) -> Result<()> {
    
    let marketplace_fee = (self.marketplace.fee as u64)
    .checked_mul(self.listing.price)
    .unwrap()
    .checked_div(10000_u64)
    .unwrap();
        
    let cpi_program = self.system_program.to_account_info();

    let cpi_accounts = Transfer {
      from: self.taker.to_account_info(),
      to: self.maker.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    let amount = self.listing.price.checked_sub(marketplace_fee).unwrap();

    transfer(cpi_ctx, amount)?;

    let cpi_accounts = Transfer {
      from: self.taker.to_account_info(),
      to: self.treasury.to_account_info(),
    };

    transfer(cpi_ctx, cpi_accounts)
  }

  pub send_nft(&self mut) -> Result<()> {
    Ok(())
  }
}