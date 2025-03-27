// Programs
pub mod Turbin3_prereq {

    use borsh::{BorshSerialize, to_vec};
    use solana_sdk::{
        hash::Hash,
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
        signature::{Keypair, Signer},
        transaction::Transaction,
    };

    #[derive(Debug, BorshSerialize)]
    pub struct CompleteArgs {
        pub github: Vec<u8>,
    }

    #[derive(Debug, BorshSerialize)]
    pub struct UpdateArgs {}

    #[derive(Debug)]
    pub struct Turbin3PrereqProgram {
        pub complete: Transaction,
        pub update: Transaction,
    }

    impl Turbin3PrereqProgram {
        pub fn id() -> Pubkey {
            Pubkey::new_from_array([
                136, 244, 98, 77, 157, 59, 202, 32, 47, 139, 150, 234, 137, 11, 26, 146, 165, 158,
                62, 201, 80, 69, 12, 251, 182, 149, 253, 106, 28, 95, 211, 99,
            ])
        }

        pub fn address() -> Pubkey {
            Pubkey::new_from_array([
                136, 244, 98, 77, 157, 59, 202, 32, 47, 139, 150, 234, 137, 11, 26, 146, 165, 158,
                62, 201, 80, 69, 12, 251, 182, 149, 253, 106, 28, 95, 211, 99,
            ])
        }

        pub fn derive_program_address(seeds: &[&[u8]]) -> Pubkey {
            Self::derive_program_address_and_bump(seeds).0
        }

        pub fn derive_program_address_and_bump(seeds: &[&[u8]]) -> (Pubkey, u8) {
            Pubkey::find_program_address(seeds, &Self::id())
        }

        pub fn complete_ix_from_bytes(accounts: &[&Pubkey; 3usize], bytes: &[u8]) -> Instruction {
            let account_meta: Vec<AccountMeta> = vec![
                AccountMeta::new(accounts[0usize].clone(), true),
                AccountMeta::new(accounts[1usize].clone(), false),
                AccountMeta::new_readonly(accounts[2usize].clone(), false),
            ];
            Instruction::new_with_bytes(Self::id(), &bytes, account_meta)
        }

        pub fn complete_ix_from_data(
            accounts: &[&Pubkey; 3usize],
            args: &CompleteArgs,
        ) -> Instruction {
            let mut data_bytes: Vec<u8> = vec![0, 77, 224, 147, 136, 25, 88, 76];
            data_bytes.extend_from_slice(&to_vec(&args).expect("Unable to serialize data"));
            Self::complete_ix_from_bytes(accounts, &data_bytes)
        }

        pub fn complete(
            accounts: &[&Pubkey; 3],
            args: &CompleteArgs,
            payer: Option<&Pubkey>,
            signers: &[&Keypair],
            blockhash: Hash,
        ) -> Transaction {
            let ix = Self::complete_ix_from_data(accounts, args);
            Transaction::new_signed_with_payer(&[ix], payer, signers, blockhash)
        }
    }
}
