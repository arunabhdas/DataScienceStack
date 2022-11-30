package com.arunabhdas.datasciencestack.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Department.
 */
@Entity
@Table(name = "department")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "department_name", nullable = false)
    private String departmentName;

    @JsonIgnoreProperties(value = { "country" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Location location;

    /**
     * A relationship
     */
    @Schema(description = "A relationship")
    @OneToMany(mappedBy = "department")
    @JsonIgnoreProperties(value = { "areas", "department" }, allowSetters = true)
    private Set<Scientist> scientists = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Department id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return this.departmentName;
    }

    public Department departmentName(String departmentName) {
        this.setDepartmentName(departmentName);
        return this;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Department location(Location location) {
        this.setLocation(location);
        return this;
    }

    public Set<Scientist> getScientists() {
        return this.scientists;
    }

    public void setScientists(Set<Scientist> scientists) {
        if (this.scientists != null) {
            this.scientists.forEach(i -> i.setDepartment(null));
        }
        if (scientists != null) {
            scientists.forEach(i -> i.setDepartment(this));
        }
        this.scientists = scientists;
    }

    public Department scientists(Set<Scientist> scientists) {
        this.setScientists(scientists);
        return this;
    }

    public Department addScientist(Scientist scientist) {
        this.scientists.add(scientist);
        scientist.setDepartment(this);
        return this;
    }

    public Department removeScientist(Scientist scientist) {
        this.scientists.remove(scientist);
        scientist.setDepartment(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Department)) {
            return false;
        }
        return id != null && id.equals(((Department) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Department{" +
            "id=" + getId() +
            ", departmentName='" + getDepartmentName() + "'" +
            "}";
    }
}
