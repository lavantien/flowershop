package com.lavantien.flowershop.api.bill;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
	List<Bill> findByUserId(Long userId);
}
