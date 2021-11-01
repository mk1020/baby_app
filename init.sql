--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dddd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dddd (
    "222" integer NOT NULL
);


ALTER TABLE public.dddd OWNER TO postgres;

--
-- Name: table_na; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_na (
    column_1 integer NOT NULL
);


ALTER TABLE public.table_na OWNER TO postgres;

--
-- Name: table_na_column_1_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.table_na_column_1_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.table_na_column_1_seq OWNER TO postgres;

--
-- Name: table_na_column_1_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.table_na_column_1_seq OWNED BY public.table_na.column_1;


--
-- Name: table_name; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_name (
    user_id bigint NOT NULL,
    name character varying(60),
    email character varying(256),
    status text,
    gender character varying(50),
    password_hash character varying(30),
    diary bigint
);


ALTER TABLE public.table_name OWNER TO postgres;

--
-- Name: table_name123; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_name123 (
    column_1 integer NOT NULL,
    column_2 integer
);


ALTER TABLE public.table_name123 OWNER TO postgres;

--
-- Name: table_name123_column_1_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.table_name123_column_1_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.table_name123_column_1_seq OWNER TO postgres;

--
-- Name: table_name123_column_1_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.table_name123_column_1_seq OWNED BY public.table_name123.column_1;


--
-- Name: table_na column_1; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_na ALTER COLUMN column_1 SET DEFAULT nextval('public.table_na_column_1_seq'::regclass);


--
-- Name: table_name123 column_1; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_name123 ALTER COLUMN column_1 SET DEFAULT nextval('public.table_name123_column_1_seq'::regclass);


--
-- Data for Name: dddd; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dddd ("222") FROM stdin;
\.


--
-- Data for Name: table_na; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.table_na (column_1) FROM stdin;
\.


--
-- Data for Name: table_name; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.table_name (user_id, name, email, status, gender, password_hash, diary) FROM stdin;
\.


--
-- Data for Name: table_name123; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.table_name123 (column_1, column_2) FROM stdin;
\.


--
-- Name: table_na_column_1_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.table_na_column_1_seq', 1, false);


--
-- Name: table_name123_column_1_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.table_name123_column_1_seq', 1, false);


--
-- Name: dddd dddd_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dddd
    ADD CONSTRAINT dddd_pk PRIMARY KEY ("222");


--
-- Name: table_na table_na_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_na
    ADD CONSTRAINT table_na_pk PRIMARY KEY (column_1);


--
-- Name: table_name123 table_name123_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_name123
    ADD CONSTRAINT table_name123_pk PRIMARY KEY (column_1);


--
-- Name: table_name table_name_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_name
    ADD CONSTRAINT table_name_email_key UNIQUE (email);


--
-- Name: table_name table_name_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_name
    ADD CONSTRAINT table_name_pkey PRIMARY KEY (user_id);


--
-- Name: dddd_222_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX dddd_222_uindex ON public.dddd USING btree ("222");


--
-- Name: table_na_column_1_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX table_na_column_1_uindex ON public.table_na USING btree (column_1);


--
-- Name: table_name123_column_1_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX table_name123_column_1_uindex ON public.table_name123 USING btree (column_1);


--
-- PostgreSQL database dump complete
--

