--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: internshipcompensation; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE internshipcompensation (
    id integer NOT NULL,
    content character varying(1000),
    "position" integer
);


ALTER TABLE internshipcompensation OWNER TO scott;

--
-- Name: internshipcompensation_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE internshipcompensation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE internshipcompensation_id_seq OWNER TO scott;

--
-- Name: internshipcompensation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE internshipcompensation_id_seq OWNED BY internshipcompensation.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY internshipcompensation ALTER COLUMN id SET DEFAULT nextval('internshipcompensation_id_seq'::regclass);


--
-- Data for Name: internshipcompensation; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY internshipcompensation (id, content, "position") FROM stdin;
1	Meals including fresh produce from the farm, grass-fed beef and pork, pastured chickens, and raw-milk, all raised responsibly and locally by friends	\N
2	Housing in the renovated loft of our reconstructed 100+ year old barn is available but not required	\N
3	Weekly stipend increasing with length of stay and performance	\N
\.


--
-- Name: internshipcompensation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('internshipcompensation_id_seq', 3, true);


--
-- Name: internshipcompensation_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY internshipcompensation
    ADD CONSTRAINT internshipcompensation_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

