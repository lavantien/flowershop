package com.schoolproject.flowershop.api.a;

import org.hibernate.validator.constraints.Length;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class Test {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	@Length(max = 2000)
	private String detail;
	private Date updateDate;

	public Test() {
	}

	public Test(String name, @Length(max = 2000) String detail, Date updateDate) {
		this.name = name;
		this.detail = detail;
		this.updateDate = updateDate;
	}

	@Override
	public String toString() {
		return "Test{" +
			"id=" + id +
			", name='" + name + '\'' +
			", detail='" + detail + '\'' +
			", updateDate=" + updateDate +
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

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
}
