import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantStubService } from './product-variant-stub.service';

describe('ProductVariantService', () => {
  let service: ProductVariantStubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantStubService],
    }).compile();

    service = module.get<ProductVariantStubService>(ProductVariantStubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
