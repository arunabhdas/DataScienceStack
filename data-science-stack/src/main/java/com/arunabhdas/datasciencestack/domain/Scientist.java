package com.arunabhdas.datasciencestack.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * The Scientist entity.
 */
@Schema(description = "The Scientist entity.")
@Entity
@Table(name = "scientist")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Scientist implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    /**
     * The firstname attribute.
     */
    @Schema(description = "The firstname attribute.")
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "salary")
    private Long salary;

    @Column(name = "percentage")
    private Long percentage;

    @OneToMany(mappedBy = "scientist")
    @JsonIgnoreProperties(value = { "tasks", "scientist" }, allowSetters = true)
    private Set<Area> areas = new HashSet<>();

    /**
     * Another side of the same relationship
     */
    @Schema(description = "Another side of the same relationship")
    @ManyToOne
    @JsonIgnoreProperties(value = { "location", "scientists" }, allowSetters = true)
    private Department department;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Scientist id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Scientist firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Scientist lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Scientist email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Scientist phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public Scientist startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Long getSalary() {
        return this.salary;
    }

    public Scientist salary(Long salary) {
        this.setSalary(salary);
        return this;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    public Long getPercentage() {
        return this.percentage;
    }

    public Scientist percentage(Long percentage) {
        this.setPercentage(percentage);
        return this;
    }

    public void setPercentage(Long percentage) {
        this.percentage = percentage;
    }

    public Set<Area> getAreas() {
        return this.areas;
    }

    public void setAreas(Set<Area> areas) {
        if (this.areas != null) {
            this.areas.forEach(i -> i.setScientist(null));
        }
        if (areas != null) {
            areas.forEach(i -> i.setScientist(this));
        }
        this.areas = areas;
    }

    public Scientist areas(Set<Area> areas) {
        this.setAreas(areas);
        return this;
    }

    public Scientist addArea(Area area) {
        this.areas.add(area);
        area.setScientist(this);
        return this;
    }

    public Scientist removeArea(Area area) {
        this.areas.remove(area);
        area.setScientist(null);
        return this;
    }

    public Department getDepartment() {
        return this.department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Scientist department(Department department) {
        this.setDepartment(department);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Scientist)) {
            return false;
        }
        return id != null && id.equals(((Scientist) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Scientist{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", salary=" + getSalary() +
            ", percentage=" + getPercentage() +
            "}";
    }
}
