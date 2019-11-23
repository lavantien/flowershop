package com.schoolproject.flowershop.api.a;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
public class TestController {
	private TestRepository testRepository;

	@Autowired
	public TestController(TestRepository testRepository) {
		this.testRepository = testRepository;
	}

	@GetMapping
	public ResponseEntity<List<Test>> getAll() {
		return ResponseEntity.ok(testRepository.findAll());
	}

	@PostMapping
	public ResponseEntity<List<Test>> createMany(@RequestBody List<Test> tests) {
		return ResponseEntity.ok(testRepository.saveAll(tests));
	}

	@DeleteMapping
	public ResponseEntity deleteMany(@RequestBody(required = false) List<Long> ids) {
		if (ids == null) {
			testRepository.deleteAll();
			return ResponseEntity.ok().build();
		}
		testRepository.deleteAll(testRepository.findAllById(ids));
		return ResponseEntity.ok().build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Test> getById(@PathVariable Long id) {
		Optional<Test> test = testRepository.findById(id);
		if (test.isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(test.get());
	}

	@PostMapping("/create")
	public ResponseEntity<Test> create(@RequestBody Test test) {
		return ResponseEntity.ok(test);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Test> update(@PathVariable Long id, @RequestBody Test test) {
		if (testRepository.findById(id).isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(testRepository.save(test));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity delete(@PathVariable Long id) {
		if (testRepository.findById(id).isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		testRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}
}
