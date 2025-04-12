import { publicKey } from '@metaplex-foundation/umi';
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultAnchor } from "../target/types/vault_anchor";

describe("vault-anchor", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VaultAnchor as Program<VaultAnchor>;

  const vaultState = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), provider.publicKey.toBytes()],
    program.programId
  )[0];

  const vault = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultState.toBytes()],
    program.programId
  )[0];
  const systemProgram = anchor.web3.SystemProgram.programId;

  it("should be initialize-able", async () => {
    const tx = await program.methods
    .initialize()
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState,
      vault,
      systemProgram,
    })
    .rpc();

    console.log(`Your transaction signature`, tx);
    console.log(
      'Your vault info',
      await provider.connection.getAccountInfo(vault)
    );
  });

  it("should allow deposits of sol", async () => {
    const tx = await program.methods
      .deposit(new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram,
      });

      console.log(`Your transaction signature`, tx);
      console.log(
        'Your vault info',
        await provider.connection.getAccountInfo(vault)
      );
      console.log(
        'Your vault balance',
        ((await provider.connection.getBalance(vault)).toString())
      );
  });

  it('should allow withdrawals', async () => {
    const tx = await program.methods
      .withdraw(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState,
        vault,
        systemProgram,
      });

      console.log(`Your transaction signature`, tx);
      console.log(
        'Your vault info',
        await provider.connection.getAccountInfo(vault)
      );
      console.log(
        'Your vault balance',
        ((await provider.connection.getBalance(vault)).toString())
      );
  });

  it('should allow the vault to be closed', async () => {
    const tx = await program.methods
    .close()
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState,
      vault,
      systemProgram,
    });

    console.log(`Your transaction signature`, tx);
    console.log(
      'Your vault info',
      await provider.connection.getAccountInfo(vault)
    );
    console.log(
      'Your vault balance',
      ((await provider.connection.getBalance(vault)).toString())
    );
  })



});
