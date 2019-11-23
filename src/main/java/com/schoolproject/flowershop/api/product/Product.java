package com.schoolproject.flowershop.api.product;

import org.hibernate.validator.constraints.Length;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String name;
	@Length(max = 2000)
	private String description;
	@Length(max = 2000)
	private String imgUrl;
	private Double price;
	private Long quantity;
	private Long saleAmount;
	private Long categoryId;

	public Product() {
	}

	public Product(String name, @Length(max = 2000) String description, @Length(max = 2000) String imgUrl, Double price, Long quantity, Long saleAmount, Long categoryId) {
		this.name = name;
		this.description = description;
		this.imgUrl = imgUrl;
		this.price = price;
		this.quantity = quantity;
		this.saleAmount = saleAmount;
		this.categoryId = categoryId;
	}

	@Override
	public String toString() {
		return "Product{" +
			"id=" + id +
			", name='" + name + '\'' +
			", description='" + description + '\'' +
			", imgUrl='" + imgUrl + '\'' +
			", price=" + price +
			", quantity=" + quantity +
			", saleAmount=" + saleAmount +
			", categoryId=" + categoryId +
			'}';
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Long getQuantity() {
		return quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public Long getSaleAmount() {
		return saleAmount;
	}

	public void setSaleAmount(Long saleAmount) {
		this.saleAmount = saleAmount;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
}
