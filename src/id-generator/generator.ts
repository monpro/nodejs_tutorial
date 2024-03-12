class SnowFlakeIDGenerator {
  private readonly epoch: number;
  private readonly datacenterId: number;
  private readonly machineId: number;
  private sequence: number = 0
  private lastTimeStamp: number = -1


  constructor(datacenterId: number, machineId: number, epoch?: number) {
    this.datacenterId = datacenterId
    this.machineId = machineId
    this.epoch = epoch || Date.parse("2020-01-01T00:00:00Z")
    if (this.datacenterId < 0 && this.datacenterId > 31) {
      throw new Error("Datacenter ID must be in range 0 - 31")
    }
    if (this.machineId < 0 || this.machineId > 31) {
      throw new Error("Machine ID must be in range 0 - 31")
    }
  }

  private currentTime(): number {
    return Date.now()
  }

  private tillNextMills(lastTimeStamp: number) : number {
    let timeStamp = this.currentTime()
    while (timeStamp <= lastTimeStamp) {
      timeStamp = this.currentTime()
    }
    return timeStamp
  }

  public generate() : string {
    let timestamp = this.currentTime() - this.epoch
    console.log(timestamp)
    if (timestamp < this.lastTimeStamp) {
      throw new Error("Clock moved backwards. Refusing to generate id for " + (this.lastTimeStamp - timestamp) + " milliseconds");
    }
    // This condition is designed to ensure that if multiple IDs are requested within the same millisecond,
    // the sequence number is incremented to provide unique IDs within that millisecond.
    if (this.lastTimeStamp == timestamp) {
      this.sequence = (this.sequence + 1) & 4095
      if (this.sequence == 0) {
        timestamp =  this.tillNextMills(this.lastTimeStamp)
      }
    } else {
      this.sequence = 0
    }
    this.lastTimeStamp = timestamp;
    return `${timestamp.toString().padStart(10, '0')}${this.datacenterId.toString().padStart(2, '0')}${this.machineId.toString().padStart(2, '0')}${this.sequence.toString().padStart(4, '0')}`;  }
}

class EntityIDGenerator {
  private idGenerator: SnowFlakeIDGenerator
  private entityTypePrefix: {[key: string] : string}

  constructor(idGenerator: SnowFlakeIDGenerator) {
    this.idGenerator = idGenerator
    this.entityTypePrefix = {
      user: 'U',
      order: 'O',
      product: 'P'
    }
  }

  generate(entityType: string): string {
    if (!this.entityTypePrefix[entityType]) {
      throw new Error(`Unknown entity type: ${entityType}`)
    }
    const prefix = this.entityTypePrefix[entityType]
    const id = this.idGenerator.generate().toString()
    return `${prefix}${id}`
  }
}


const snowflakeGenerator = new SnowFlakeIDGenerator(1, 1); // Assuming a SnowflakeIDGenerator instance
const entityIDGenerator = new EntityIDGenerator(snowflakeGenerator);

const userID = entityIDGenerator.generate('user');
const orderID = entityIDGenerator.generate('order');
console.log(userID);  // Output: U1234567890...
console.log(orderID); // Output: O1234567890...
console.log(snowflakeGenerator.generate())
