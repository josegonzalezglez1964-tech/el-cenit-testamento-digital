import { createHash } from 'crypto';

export interface BlockchainRecord {
  hash: string;
  timestamp: number;
  data: string;
  previousHash: string;
}

export class BlockchainService {
  private chain: BlockchainRecord[] = [];

  constructor() {
    // Bloque génesis
    this.chain.push({
      hash: this.calculateHash('genesis', 0, '0'),
      timestamp: Date.now(),
      data: 'genesis',
      previousHash: '0',
    });
  }

  private calculateHash(data: string, timestamp: number, previousHash: string): string {
    return createHash('sha256')
      .update(data + timestamp + previousHash)
      .digest('hex');
  }

  addRecord(data: string): BlockchainRecord {
    const previousBlock = this.chain[this.chain.length - 1];
    const timestamp = Date.now();
    const hash = this.calculateHash(data, timestamp, previousBlock.hash);

    const record: BlockchainRecord = {
      hash,
      timestamp,
      data,
      previousHash: previousBlock.hash,
    };

    this.chain.push(record);
    return record;
  }

  verifyChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.previousHash !== previous.hash) return false;
      if (current.hash !== this.calculateHash(current.data, current.timestamp, current.previousHash)) {
        return false;
      }
    }
    return true;
  }

  getChain(): BlockchainRecord[] {
    return [...this.chain];
  }

  getLastRecord(): BlockchainRecord {
    return this.chain[this.chain.length - 1];
  }
}

export function generateDocumentHash(documentContent: string): string {
  return createHash('sha256').update(documentContent).digest('hex');
}

export function verifyDocumentHash(documentContent: string, expectedHash: string): boolean {
  const actualHash = generateDocumentHash(documentContent);
  return actualHash === expectedHash;
}