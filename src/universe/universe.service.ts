import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UniverseDto } from './universe.dto';
import { Universe } from './universe.entity';

@Injectable()
export class UniverseService {
  constructor(
    @Inject('UNIVERSE_REPOSITORY')
    private universeRepository: Repository<Universe>,
  ) {}
  public async findAll(): Promise<Universe[]> {
    return this.universeRepository.find({ relations: ['heroes'] });
  }

  public async createOne(universe: UniverseDto): Promise<Universe> {
    let createdUniverse = await this.universeRepository.save(universe);
    createdUniverse = await this.universeRepository.findOne({
      where: { id: createdUniverse.id },
    });
    return createdUniverse;
  }
  public async updateOne(UniverseDto: UniverseDto): Promise<Universe> {
    const { id, name } = UniverseDto;
    let persistedUni = await this.universeRepository.findOne({
      where: { id }
    });
    if (!persistedUni) {
      throw new NotFoundException(`Universe with id ${id} was not found.`);
    }

    persistedUni = await this.universeRepository.save({ id, ...UniverseDto });
    return persistedUni;
  }

  public async deleteOne(id: number): Promise<any> {
    let persistedUni = await this.universeRepository.findOne({
      where: { id }
    });
    if (!persistedUni) {
      throw new NotFoundException(`Universe with id ${id} was not found.`);
    }
    persistedUni = (await this.universeRepository.delete({ id }))?.raw;
    return persistedUni;
  }
}
