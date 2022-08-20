import { BigNumber, BigNumberish, constants, providers, Wallet } from "ethers";
import { ERC20PresetMinterPauser__factory } from "../contract-types";

const RPC_URL = process.env.RPC_URL ?? "";
if (RPC_URL === "") {
  console.error("RPC_URL environment variable is not set");
  process.exit(1);
}

const provider = new providers.StaticJsonRpcProvider(RPC_URL);

const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY ?? "";
if (MINTER_PRIVATE_KEY === "") {
  console.error("MINTER_PRIVATE_KEY environment variable is not set");
  process.exit(1)
}

const minterWallet = new Wallet(MINTER_PRIVATE_KEY, provider);
console.log(`Minter wallet address: ${minterWallet.address}`);

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS ?? "";
if (TOKEN_ADDRESS === "") {
  console.error("TOKEN_ADDRESS environment variable is not set");
  process.exit(1);
}

// on the tests on the mumbai testnet this function took:
// * more than 3 minutes 
// * 11 seconds
// * more than 8 minutes
// * 19 minutes
// * 10 seconds
export async function mint_tokens(amount_in_wei: BigNumberish, address: string) {
  const amount = BigNumber.from(amount_in_wei);
  if (amount.isZero()) {
    throw new Error("amount must be greater than 0");
  }
  if (amount.isNegative()) {
    throw new Error("amount must be positive");
  }
  if (constants.AddressZero === address) {
    throw new Error("address can't be 0x0");
  }
  
  const tokenContract = ERC20PresetMinterPauser__factory.connect(TOKEN_ADDRESS, provider);
  
  const tx = await tokenContract.connect(minterWallet).mint(address, amount);
  // takes ~3 seconds to execute up to here on the mumbai testnet

  const receipt = await tx.wait();
  return receipt.transactionHash;
}