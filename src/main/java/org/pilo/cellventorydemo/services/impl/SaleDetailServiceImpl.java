package org.pilo.cellventorydemo.services.impl;

import org.pilo.cellventorydemo.entities.dtos.SaleDetailDto;
import org.pilo.cellventorydemo.entities.mappers.SaleDetailMapper;
import org.pilo.cellventorydemo.repositories.SaleDetailRepository;
import org.pilo.cellventorydemo.services.SaleDetailService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleDetailServiceImpl implements SaleDetailService {

    private final SaleDetailRepository saleDetailRepository;
    private final SaleDetailMapper saleDetailMapper;

    public SaleDetailServiceImpl(SaleDetailRepository saleDetailRepository, SaleDetailMapper saleDetailMapper) {
        this.saleDetailRepository = saleDetailRepository;
        this.saleDetailMapper = saleDetailMapper;
    }

    @Override
    public List<SaleDetailDto> findAll() {
        return saleDetailRepository.findAll().stream()
                .map(saleDetailMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SaleDetailDto findById(Integer id) {
        return saleDetailMapper.toDto(saleDetailRepository
                .findById(id).orElseThrow(
                        () -> new RuntimeException("Sale not found")));
    }

    @Override
    public void deleteById(Integer id) {
        if(findById(id) != null)
            saleDetailRepository.deleteById(id);
    }

    @Override
    public List<SaleDetailDto> findBySaleId(Integer saleId) {
        return saleDetailRepository.findBySaleId(saleId).stream()
                .map(saleDetailMapper::toDto)
                .toList();
    }
}
