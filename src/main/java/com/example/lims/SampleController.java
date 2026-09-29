package com.example.lims;

import com.example.lims.Sample;
import com.example.lims.SampleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/samples")
@CrossOrigin(origins = "*") // Allows React to access this API
public class SampleController {

    @Autowired
    private SampleRepository repository;

    @GetMapping
    public List<Sample> getAllSamples() {
        return repository.findAll();
    }

    @PostMapping
    public Sample createSample(@RequestBody Sample sample) {
        return repository.save(sample);
    }
    @DeleteMapping("/{id}")
    public void deleteSample(@PathVariable String id) {
        repository.deleteById(id);
    }
}