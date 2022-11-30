package com.arunabhdas.datasciencestack.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.arunabhdas.datasciencestack.IntegrationTest;
import com.arunabhdas.datasciencestack.domain.Scientist;
import com.arunabhdas.datasciencestack.repository.ScientistRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ScientistResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ScientistResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_SALARY = 1L;
    private static final Long UPDATED_SALARY = 2L;

    private static final Long DEFAULT_PERCENTAGE = 1L;
    private static final Long UPDATED_PERCENTAGE = 2L;

    private static final String ENTITY_API_URL = "/api/scientists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ScientistRepository scientistRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScientistMockMvc;

    private Scientist scientist;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Scientist createEntity(EntityManager em) {
        Scientist scientist = new Scientist()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .startDate(DEFAULT_START_DATE)
            .salary(DEFAULT_SALARY)
            .percentage(DEFAULT_PERCENTAGE);
        return scientist;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Scientist createUpdatedEntity(EntityManager em) {
        Scientist scientist = new Scientist()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .startDate(UPDATED_START_DATE)
            .salary(UPDATED_SALARY)
            .percentage(UPDATED_PERCENTAGE);
        return scientist;
    }

    @BeforeEach
    public void initTest() {
        scientist = createEntity(em);
    }

    @Test
    @Transactional
    void createScientist() throws Exception {
        int databaseSizeBeforeCreate = scientistRepository.findAll().size();
        // Create the Scientist
        restScientistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scientist)))
            .andExpect(status().isCreated());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeCreate + 1);
        Scientist testScientist = scientistList.get(scientistList.size() - 1);
        assertThat(testScientist.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testScientist.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testScientist.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testScientist.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testScientist.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testScientist.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testScientist.getPercentage()).isEqualTo(DEFAULT_PERCENTAGE);
    }

    @Test
    @Transactional
    void createScientistWithExistingId() throws Exception {
        // Create the Scientist with an existing ID
        scientist.setId(1L);

        int databaseSizeBeforeCreate = scientistRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScientistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scientist)))
            .andExpect(status().isBadRequest());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllScientists() throws Exception {
        // Initialize the database
        scientistRepository.saveAndFlush(scientist);

        // Get all the scientistList
        restScientistMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(scientist.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].salary").value(hasItem(DEFAULT_SALARY.intValue())))
            .andExpect(jsonPath("$.[*].percentage").value(hasItem(DEFAULT_PERCENTAGE.intValue())));
    }

    @Test
    @Transactional
    void getScientist() throws Exception {
        // Initialize the database
        scientistRepository.saveAndFlush(scientist);

        // Get the scientist
        restScientistMockMvc
            .perform(get(ENTITY_API_URL_ID, scientist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(scientist.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.salary").value(DEFAULT_SALARY.intValue()))
            .andExpect(jsonPath("$.percentage").value(DEFAULT_PERCENTAGE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingScientist() throws Exception {
        // Get the scientist
        restScientistMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingScientist() throws Exception {
        // Initialize the database
        scientistRepository.saveAndFlush(scientist);

        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();

        // Update the scientist
        Scientist updatedScientist = scientistRepository.findById(scientist.getId()).get();
        // Disconnect from session so that the updates on updatedScientist are not directly saved in db
        em.detach(updatedScientist);
        updatedScientist
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .startDate(UPDATED_START_DATE)
            .salary(UPDATED_SALARY)
            .percentage(UPDATED_PERCENTAGE);

        restScientistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedScientist.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedScientist))
            )
            .andExpect(status().isOk());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
        Scientist testScientist = scientistList.get(scientistList.size() - 1);
        assertThat(testScientist.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testScientist.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testScientist.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testScientist.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testScientist.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testScientist.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testScientist.getPercentage()).isEqualTo(UPDATED_PERCENTAGE);
    }

    @Test
    @Transactional
    void putNonExistingScientist() throws Exception {
        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();
        scientist.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScientistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, scientist.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scientist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScientist() throws Exception {
        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();
        scientist.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScientistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scientist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScientist() throws Exception {
        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();
        scientist.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScientistMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scientist)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScientistWithPatch() throws Exception {
        // Initialize the database
        scientistRepository.saveAndFlush(scientist);

        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();

        // Update the scientist using partial update
        Scientist partialUpdatedScientist = new Scientist();
        partialUpdatedScientist.setId(scientist.getId());

        partialUpdatedScientist
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .percentage(UPDATED_PERCENTAGE);

        restScientistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScientist.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScientist))
            )
            .andExpect(status().isOk());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
        Scientist testScientist = scientistList.get(scientistList.size() - 1);
        assertThat(testScientist.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testScientist.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testScientist.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testScientist.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testScientist.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testScientist.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testScientist.getPercentage()).isEqualTo(UPDATED_PERCENTAGE);
    }

    @Test
    @Transactional
    void fullUpdateScientistWithPatch() throws Exception {
        // Initialize the database
        scientistRepository.saveAndFlush(scientist);

        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();

        // Update the scientist using partial update
        Scientist partialUpdatedScientist = new Scientist();
        partialUpdatedScientist.setId(scientist.getId());

        partialUpdatedScientist
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .startDate(UPDATED_START_DATE)
            .salary(UPDATED_SALARY)
            .percentage(UPDATED_PERCENTAGE);

        restScientistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScientist.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScientist))
            )
            .andExpect(status().isOk());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
        Scientist testScientist = scientistList.get(scientistList.size() - 1);
        assertThat(testScientist.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testScientist.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testScientist.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testScientist.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testScientist.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testScientist.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testScientist.getPercentage()).isEqualTo(UPDATED_PERCENTAGE);
    }

    @Test
    @Transactional
    void patchNonExistingScientist() throws Exception {
        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();
        scientist.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScientistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, scientist.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scientist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScientist() throws Exception {
        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();
        scientist.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScientistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scientist))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScientist() throws Exception {
        int databaseSizeBeforeUpdate = scientistRepository.findAll().size();
        scientist.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScientistMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(scientist))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Scientist in the database
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScientist() throws Exception {
        // Initialize the database
        scientistRepository.saveAndFlush(scientist);

        int databaseSizeBeforeDelete = scientistRepository.findAll().size();

        // Delete the scientist
        restScientistMockMvc
            .perform(delete(ENTITY_API_URL_ID, scientist.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Scientist> scientistList = scientistRepository.findAll();
        assertThat(scientistList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
