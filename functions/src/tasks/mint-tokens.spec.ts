import { mint_tokens } from "./mint-tokens";

const enableMintTest = true;
if (enableMintTest) {
  describe("Mint tokens", () => {
    it("should mint tokens", async () => {
      const r = await mint_tokens(1, "0xafa93892741Cca8C2cB7bE132fbdF9322E795Df6");
      console.log(r);
    }).timeout(30 * 60 * 1000);
  });
}