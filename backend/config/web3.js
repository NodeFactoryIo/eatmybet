import dotenv from 'dotenv';

dotenv.config();

const env = process.env;

const network = env.ETHEREUM_NETWORK_URL || 'http://ethereum:8545';

export default class Web3Config {

  static url() {
    return network;
  }

}
