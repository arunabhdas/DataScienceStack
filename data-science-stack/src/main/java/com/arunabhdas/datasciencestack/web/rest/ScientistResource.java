package com.arunabhdas.datasciencestack.web.rest;

import com.arunabhdas.datasciencestack.domain.Scientist;
import com.arunabhdas.datasciencestack.repository.ScientistRepository;
import com.arunabhdas.datasciencestack.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.arunabhdas.datasciencestack.domain.Scientist}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ScientistResource {

    private final Logger log = LoggerFactory.getLogger(ScientistResource.class);

    private static final String ENTITY_NAME = "scientist";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ScientistRepository scientistRepository;

    public ScientistResource(ScientistRepository scientistRepository) {
        this.scientistRepository = scientistRepository;
    }

    /**
     * {@code POST  /scientists} : Create a new scientist.
     *
     * @param scientist the scientist to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new scientist, or with status {@code 400 (Bad Request)} if the scientist has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/scientists")
    public ResponseEntity<Scientist> createScientist(@RequestBody Scientist scientist) throws URISyntaxException {
        log.debug("REST request to save Scientist : {}", scientist);
        if (scientist.getId() != null) {
            throw new BadRequestAlertException("A new scientist cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Scientist result = scientistRepository.save(scientist);
        return ResponseEntity
            .created(new URI("/api/scientists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /scientists/:id} : Updates an existing scientist.
     *
     * @param id the id of the scientist to save.
     * @param scientist the scientist to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated scientist,
     * or with status {@code 400 (Bad Request)} if the scientist is not valid,
     * or with status {@code 500 (Internal Server Error)} if the scientist couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/scientists/{id}")
    public ResponseEntity<Scientist> updateScientist(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Scientist scientist
    ) throws URISyntaxException {
        log.debug("REST request to update Scientist : {}, {}", id, scientist);
        if (scientist.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, scientist.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scientistRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Scientist result = scientistRepository.save(scientist);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, scientist.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /scientists/:id} : Partial updates given fields of an existing scientist, field will ignore if it is null
     *
     * @param id the id of the scientist to save.
     * @param scientist the scientist to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated scientist,
     * or with status {@code 400 (Bad Request)} if the scientist is not valid,
     * or with status {@code 404 (Not Found)} if the scientist is not found,
     * or with status {@code 500 (Internal Server Error)} if the scientist couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/scientists/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Scientist> partialUpdateScientist(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Scientist scientist
    ) throws URISyntaxException {
        log.debug("REST request to partial update Scientist partially : {}, {}", id, scientist);
        if (scientist.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, scientist.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scientistRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Scientist> result = scientistRepository
            .findById(scientist.getId())
            .map(existingScientist -> {
                if (scientist.getFirstName() != null) {
                    existingScientist.setFirstName(scientist.getFirstName());
                }
                if (scientist.getLastName() != null) {
                    existingScientist.setLastName(scientist.getLastName());
                }
                if (scientist.getEmail() != null) {
                    existingScientist.setEmail(scientist.getEmail());
                }
                if (scientist.getPhoneNumber() != null) {
                    existingScientist.setPhoneNumber(scientist.getPhoneNumber());
                }
                if (scientist.getStartDate() != null) {
                    existingScientist.setStartDate(scientist.getStartDate());
                }
                if (scientist.getSalary() != null) {
                    existingScientist.setSalary(scientist.getSalary());
                }
                if (scientist.getPercentage() != null) {
                    existingScientist.setPercentage(scientist.getPercentage());
                }

                return existingScientist;
            })
            .map(scientistRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, scientist.getId().toString())
        );
    }

    /**
     * {@code GET  /scientists} : get all the scientists.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of scientists in body.
     */
    @GetMapping("/scientists")
    public ResponseEntity<List<Scientist>> getAllScientists(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Scientists");
        Page<Scientist> page = scientistRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /scientists/:id} : get the "id" scientist.
     *
     * @param id the id of the scientist to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the scientist, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/scientists/{id}")
    public ResponseEntity<Scientist> getScientist(@PathVariable Long id) {
        log.debug("REST request to get Scientist : {}", id);
        Optional<Scientist> scientist = scientistRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(scientist);
    }

    /**
     * {@code DELETE  /scientists/:id} : delete the "id" scientist.
     *
     * @param id the id of the scientist to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/scientists/{id}")
    public ResponseEntity<Void> deleteScientist(@PathVariable Long id) {
        log.debug("REST request to delete Scientist : {}", id);
        scientistRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
