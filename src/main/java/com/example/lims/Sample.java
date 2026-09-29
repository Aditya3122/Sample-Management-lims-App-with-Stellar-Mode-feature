package com.example.lims;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "samples")
public class Sample {

    @Id
    private String id;
    private String name;
    private String status;
    private String date;

    // Constructors
    public Sample() {}

    public Sample(String id, String name, String status, String date) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.date = date;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}