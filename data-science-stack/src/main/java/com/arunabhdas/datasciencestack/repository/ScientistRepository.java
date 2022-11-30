package com.arunabhdas.datasciencestack.repository;

import com.arunabhdas.datasciencestack.domain.Scientist;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Scientist entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScientistRepository extends JpaRepository<Scientist, Long> {}
