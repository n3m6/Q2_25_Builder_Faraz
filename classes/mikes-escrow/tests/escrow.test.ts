import { before, describe, test, it } from "node:test";
import assert from "node:assert";
import * as programClient from "../dist/js-client";
import { connect, Connection, SOL, TOKEN_EXTENSIONS_PROGRAM } from "solana-kite";

// For debugging. You could delete these, but then someone else will have to recreate them and then they'll be annoyed with you.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = console.log;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stringify = (object: any) => JSON.stringify(object, null, 2);

import { lamports, type KeyPairSigner, type Address } from "@solana/kit";

const ONE_SOL = lamports(1n * SOL);

// SPL Token program errors
// Reference: https://github.com/solana-program/token-2022/blob/main/program/src/error.rs#L11-L13
enum SplTokenError {
  InsufficientFunds = 1,
}

// Anchor framework errors (2000-2999 range)
// Reference: https://github.com/coral-xyz/anchor/blob/master/lang/src/error.rs#L72-L74
enum AnchorError {
  ConstraintSeeds = 2006,
}

const getRandomBigInt = () => {
  return BigInt(Math.floor(Math.random() * 1_000_000_000_000_000_000));
};

// Helper function to check for specific program errors
// Note: Solana errors do not include the program ID in the error object, so we can only check the error code in the message.
function assertProgramError(error: Error, expectedCode: SplTokenError | AnchorError) {
  // Only check the error code in the message
  assert(
    error.message.includes(`custom program error: #${expectedCode}`),
    `Expected error code ${expectedCode} but got: ${error.message}`,
  );
}

// Helper function to create a test offer
async function createTestOffer(params: {
  connection: Connection;
  maker: KeyPairSigner;
  tokenMintA: Address;
  tokenMintB: Address;
  makerTokenAccountA: Address;
  tokenAOfferedAmount: bigint;
  tokenBWantedAmount: bigint;
  offerId?: bigint;
}) {
  const {
    connection,
    maker,
    tokenMintA,
    tokenMintB,
    makerTokenAccountA,
    tokenAOfferedAmount,
    tokenBWantedAmount,
    offerId = getRandomBigInt(),
  } = params;

  const offerPDAAndBump = await connection.getPDAAndBump(programClient.ESCROW_PROGRAM_ADDRESS, [
    "offer",
    maker.address,
    offerId,
  ]);
  const offer = offerPDAAndBump.pda;
  const vault = await connection.getTokenAccountAddress(offer, tokenMintA, true);

  const makeOfferInstruction = await programClient.getMakeOfferInstructionAsync({
    maker,
    tokenMintA,
    tokenMintB,
    makerTokenAccountA,
    offer,
    vault,
    id: offerId,
    tokenAOfferedAmount,
    tokenBWantedAmount,
    tokenProgram: TOKEN_EXTENSIONS_PROGRAM,
  });

  await connection.sendTransactionFromInstructions({
    feePayer: maker,
    instructions: [makeOfferInstruction],
  });

  return { offer, vault, offerId };
}

describe("Escrow", () => {
  let connection: Connection;
  let user: KeyPairSigner;
  let alice: KeyPairSigner;
  let bob: KeyPairSigner;
  let tokenMintA: Address;
  let tokenMintB: Address;
  let aliceTokenAccountA: Address;
  let bobTokenAccountA: Address;
  let aliceTokenAccountB: Address;

  const tokenAOfferedAmount = 1_000_000_000n;
  const tokenBWantedAmount = 1_000_000_000n;

  before(async () => {
    connection = await connect();
    [user, alice, bob] = await connection.createWallets(3, { airdropAmount: ONE_SOL });

    tokenMintA = await connection.createTokenMint({
      mintAuthority: user,
      decimals: 9,
      name: "Token A",
      symbol: "TOKEN_A",
      uri: "https://example.com/token-a",
      additionalMetadata: {
        keyOne: "valueOne",
        keyTwo: "valueTwo",
      },
    });

    tokenMintB = await connection.createTokenMint({
      mintAuthority: user,
      decimals: 9,
      name: "Token B",
      symbol: "TOKEN_B",
      uri: "https://example.com/token-b",
      additionalMetadata: {
        keyOne: "valueOne",
        keyTwo: "valueTwo",
      },
    });

    await connection.mintTokens(tokenMintA, user, 10n * tokenAOfferedAmount, alice.address);
    aliceTokenAccountA = await connection.getTokenAccountAddress(alice.address, tokenMintA, true);
    await connection.mintTokens(tokenMintB, user, 1_000_000_000n, bob.address);

    bobTokenAccountA = await connection.getTokenAccountAddress(bob.address, tokenMintA, true);
    aliceTokenAccountB = await connection.getTokenAccountAddress(alice.address, tokenMintB, true);
  });

  describe("makeOffer", () => {
    test("successfully creates an offer with valid inputs", async () => {
      const { offer, vault } = await createTestOffer({
        connection,
        maker: alice,
        tokenMintA,
        tokenMintB,
        makerTokenAccountA: aliceTokenAccountA,
        tokenAOfferedAmount,
        tokenBWantedAmount,
      });

      // Verify the offer was created successfully by checking the vault balance
      const vaultBalanceResponse = await connection.getTokenAccountBalance({
        tokenAccount: vault,
        mint: tokenMintA,
        useTokenExtensions: true,
      });
      assert(vaultBalanceResponse.amount === tokenAOfferedAmount);
    });

    test("fails when maker has insufficient token balance", async () => {
      const tooManyTokens = 1_000_000_000_000n;

      try {
        await createTestOffer({
          connection,
          maker: alice,
          tokenMintA,
          tokenMintB,
          makerTokenAccountA: aliceTokenAccountA,
          tokenAOfferedAmount: tooManyTokens,
          tokenBWantedAmount,
        });
        assert.fail("Expected the offer creation to fail but it succeeded");
      } catch (thrownObject) {
        const error = thrownObject as Error;
        assertProgramError(error, SplTokenError.InsufficientFunds);
      }
    });
  });

  describe.skip("takeOffer", () => {
    let testOffer: Address;
    let testVault: Address;

    before(async () => {
      const result = await createTestOffer({
        connection,
        maker: alice,
        tokenMintA,
        tokenMintB,
        makerTokenAccountA: aliceTokenAccountA,
        tokenAOfferedAmount,
        tokenBWantedAmount,
      });
      testOffer = result.offer;
      testVault = result.vault;
    });

    test("successfully takes an offer", async () => {
      const takeOfferInstruction = await programClient.getTakeOfferInstructionAsync({
        taker: bob,
        maker: alice.address,
        tokenMintA,
        tokenMintB,
        takerTokenAccountA: bobTokenAccountA,
        makerTokenAccountB: aliceTokenAccountB,
        offer: testOffer,
        vault: testVault,
        tokenProgram: TOKEN_EXTENSIONS_PROGRAM,
      });

      await connection.sendTransactionFromInstructions({
        feePayer: alice,
        instructions: [takeOfferInstruction],
      });

      // Verify token transfers
      const bobTokenABalance = await connection.getTokenAccountBalance({
        tokenAccount: bobTokenAccountA,
        mint: tokenMintA,
        useTokenExtensions: true,
      });
      assert(bobTokenABalance.amount === tokenAOfferedAmount);

      const aliceTokenBBalance = await connection.getTokenAccountBalance({
        tokenAccount: aliceTokenAccountB,
        mint: tokenMintB,
        useTokenExtensions: true,
      });
      assert(aliceTokenBBalance.amount === tokenBWantedAmount);
    });

    test("fails when taker has insufficient token balance", async () => {
      const { offer, vault } = await createTestOffer({
        connection,
        maker: alice,
        tokenMintA,
        tokenMintB,
        makerTokenAccountA: aliceTokenAccountA,
        tokenAOfferedAmount,
        tokenBWantedAmount: 10_000_000_000n,
      });

      const takeOfferInstruction = await programClient.getTakeOfferInstructionAsync({
        taker: bob,
        maker: alice.address,
        tokenMintA,
        tokenMintB,
        takerTokenAccountA: bobTokenAccountA,
        makerTokenAccountB: aliceTokenAccountB,
        offer,
        vault,
        tokenProgram: TOKEN_EXTENSIONS_PROGRAM,
      });

      try {
        await connection.sendTransactionFromInstructions({
          feePayer: bob,
          instructions: [takeOfferInstruction],
        });
        assert.fail("Expected the take offer to fail but it succeeded");
      } catch (thrownObject) {
        const error = thrownObject as Error;
        assertProgramError(error, SplTokenError.InsufficientFunds);
      }
    });
  });

  describe.skip("refundOffer", () => {
    let testOffer: Address;
    let testVault: Address;

    before(async () => {
      const result = await createTestOffer({
        connection,
        maker: alice,
        tokenMintA,
        tokenMintB,
        makerTokenAccountA: aliceTokenAccountA,
        tokenAOfferedAmount,
        tokenBWantedAmount,
      });
      testOffer = result.offer;
      testVault = result.vault;
    });

    test("successfully refunds an offer to the maker", async () => {
      const aliceBalanceBefore = await connection.getTokenAccountBalance({
        tokenAccount: aliceTokenAccountA,
        mint: tokenMintA,
        useTokenExtensions: true,
      });

      const refundOfferInstruction = await programClient.getRefundOfferInstructionAsync({
        maker: alice,
        tokenMintA,
        makerTokenAccountA: aliceTokenAccountA,
        offer: testOffer,
        vault: testVault,
        tokenProgram: TOKEN_EXTENSIONS_PROGRAM,
      });

      await connection.sendTransactionFromInstructions({
        feePayer: alice,
        instructions: [refundOfferInstruction],
      });

      // Verify refund
      const aliceBalanceAfter = await connection.getTokenAccountBalance({
        tokenAccount: aliceTokenAccountA,
        mint: tokenMintA,
        useTokenExtensions: true,
      });
      assert(aliceBalanceAfter.amount > aliceBalanceBefore.amount);

      // Verify vault is closed
      const isClosed = await connection.checkTokenAccountIsClosed({
        tokenAccount: testVault,
        useTokenExtensions: true,
      });
      assert(isClosed);
    });

    test("fails when non-maker tries to refund the offer", async () => {
      const { offer, vault } = await createTestOffer({
        connection,
        maker: alice,
        tokenMintA,
        tokenMintB,
        makerTokenAccountA: aliceTokenAccountA,
        tokenAOfferedAmount,
        tokenBWantedAmount,
      });

      const refundOfferInstruction = await programClient.getRefundOfferInstructionAsync({
        maker: bob,
        tokenMintA,
        makerTokenAccountA: bobTokenAccountA,
        offer,
        vault,
        tokenProgram: TOKEN_EXTENSIONS_PROGRAM,
      });

      try {
        await connection.sendTransactionFromInstructions({
          feePayer: bob,
          instructions: [refundOfferInstruction],
        });
        assert.fail("Expected the refund to fail but it succeeded");
      } catch (thrownObject) {
        const error = thrownObject as Error;
        assertProgramError(error, AnchorError.ConstraintSeeds);
      }
    });
  });
});
