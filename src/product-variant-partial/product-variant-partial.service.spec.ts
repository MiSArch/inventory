import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantPartialService } from './product-variant-partial.service';

describe('ProductVariantService', () => {
  let service: ProductVariantPartialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantPartialService],
    }).compile();

    service = module.get<ProductVariantPartialService>(ProductVariantPartialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
