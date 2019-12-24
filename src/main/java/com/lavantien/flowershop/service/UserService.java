package com.lavantien.flowershop.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
	public List<Long> loggedInIds = new ArrayList<>();
}
