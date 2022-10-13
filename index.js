// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");
const argv = require("argv");

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const { options: {
    address,
    amount,
} } = argv.option([
    {
        name: 'address',
        type: 'string',
    },
    {
        name: 'amount',
        type: 'int'
    }
]).run();

const newPair = new Keypair();
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
console.log("Public Key of the generated keypair", publicKey);

// Get the wallet balance from a given private key
const getWalletBalance = async (targetAirDropAddress) => {
    try {
        const walletBalance = await connection.getBalance(
            new PublicKey(targetAirDropAddress)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async (totalAmountAirDrop, targetAirDropAddress) => {
    try {
        const totalSOl = totalAmountAirDrop * LAMPORTS_PER_SOL;
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(targetAirDropAddress),
            totalSOl
        );
        await connection.confirmTransaction(fromAirDropSignature);
        console.log('airdrop sent!')
    } catch (err) {
        console.log(err);
    }
};

const mainFunction = async () => {
    const targetAirDropAddress = new PublicKey(address).toString();
    const totalAmountAirDrop = amount;
    
    await getWalletBalance(targetAirDropAddress);
    await airDropSol(totalAmountAirDrop, targetAirDropAddress);
    await getWalletBalance(targetAirDropAddress);
}

mainFunction();
