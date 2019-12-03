package com.lavantien.flowershop.api.bill;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Bill {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String placementDate;
	private Long productId;
	private Long productQuantity;
	private Double price;
	private Long userId;
	private String settlementDate;
	private String status;

	public Bill() {
	}

	public Bill(String placementDate, Long productId, Long productQuantity, Double price, Long userId, String settlementDate, String status) {
		this.placementDate = placementDate;
		this.productId = productId;
		this.productQuantity = productQuantity;
		this.price = price;
		this.userId = userId;
		this.settlementDate = settlementDate;
		this.status = status;
	}

	@Override
	public String toString() {
		return "Bill{" +
			"id=" + id +
			", placementDate='" + placementDate + '\'' +
			", productId=" + productId +
			", productQuantity=" + productQuantity +
			", price=" + price +
			", userId=" + userId +
			", settlementDate='" + settlementDate + '\'' +
			", status='" + status + '\'' +
			'}';
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPlacementDate() {
		return placementDate;
	}

	public void setPlacementDate(String placementDate) {
		this.placementDate = placementDate;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Long getProductQuantity() {
		return productQuantity;
	}

	public void setProductQuantity(Long productQuantity) {
		this.productQuantity = productQuantity;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getSettlementDate() {
		return settlementDate;
	}

	public void setSettlementDate(String settlementDate) {
		this.settlementDate = settlementDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
