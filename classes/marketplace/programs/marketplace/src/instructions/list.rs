use anchor_lang::prelude::*;
use anchor_spl::{
    token::{transfer_checked, TokenAccount, TransferChecked},
    token_interface::{Mint, TokenInterface },
};

use crate::state::{Listing, Marketplace};
use crate::instruction::Initialize;


#[derive(Accounts)]
pub struct List<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    #[account(
      seeds = [b"marketplace", name.as_a_str().as_bytes()],
      bump = marketplace.bump,
  )]
    pub marketplace: Account<'info, Marketplace>,

    pub maker_mint: InterfaceAccount<'info, Mint>,

    #[account(
    mut,
    associated_token::mint = maker_mint,
    associated_token::authority = maker,
  )]
    pub maker_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
    init,
    payer = maker,
    associated_token::mint = maker_mint,
    associated_token::authority = listing,
  )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
    init,
    payer = maker,
    seeds = [b"", marketplace.key().as_ref(), maker_mint.key().as_ref() ],
    bump,
    space = Listing::INIT_SPACE,
  )]
    pub listing: Account<'info, Listing>,

  pub collection_mint: InterfaceAccount<'info, Mint>,

    #[account(
      seeds = [
        b"metadata", 
        metadata_program.key().as_ref(), 
        maker_mint.key().as_ref()
        ],
      seeds::program = metadata_program.key(),
      bump,
      constraint = metadata.collection.as_ref().unwrap().key().as_ref() == collection_mint.key().as_ref(),
      constraint = metadata.collection.as_ref().unwrap().verified == true,
    )]
    pub metadata: Account<'info, MetadataAccount>,

    #[account(
      seeds = [
        b"metadata",
        metadata_program.key().as_ref(),
        maker_mint.key().as_ref(),
        b"edition",
      ],
      seeds::program = metadata_program.key(),
      bump,
    )]
    pub master_edition: Account<'info, MasterEditionAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_progra: Program<'info, AssociatedToken>,
    pub metadata_program: Program<'info, Metadata>,
}

impl<'info> List<'info> {
  pub fn create_listing(&mut self, price: u64, bumps: &ListBumps) -> Result<()> {
    self.listing.set_inner(Listing {
      maker: self.maker.key(),
      maker_mint: self.maker_mint.key(),
      price,
      bump: bumps.listing
    });

    Ok(())
  }

  pub fn deposit_nft(&mut self, ) -> Result<()> {
    let cpi_program = self.token_program.to_account_info();

    let cpi_account = TransferChecked {
      from: self.maker.to_account_info(),
      to:  self.vault.to_account_info(),
      mint: self.maker_mint.to_account_info(),
      authority: self.maker.to_account_info(),
    };

    let cpi_ctx : CpiContext<'_, '_, '_, '_, _>= CpiContext::new(cpi_program, cpi_account);

    transfer_checked(cpi_ctx, self.maker_ata.amount, self.maker_mint.decimals)
  }

}