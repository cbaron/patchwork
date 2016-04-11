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
-- Name: internshipduty; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE internshipduty (
    id integer NOT NULL,
    content character varying(1000),
    "position" integer
);


ALTER TABLE internshipduty OWNER TO scott;

--
-- Name: internshipduty_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE internshipduty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE internshipduty_id_seq OWNER TO scott;

--
-- Name: internshipduty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE internshipduty_id_seq OWNED BY internshipduty.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY internshipduty ALTER COLUMN id SET DEFAULT nextval('internshipduty_id_seq'::regclass);


--
-- Data for Name: internshipduty; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY internshipduty (id, content, "position") FROM stdin;
1	Starting plants from seed and transplanting seedlings into the garden	\N
2	Preparation and maintenance of garden including tilling, broadforking, spreading manure, watering, weeding and mulching	\N
3	Harvesting, cleaning, packing, and delivering produce for our CSA, wholesale customers, and farmers markets	\N
4	Sharing in responsibility of feeding, watering, and other care of livestock (chickens, pigs, sheep)	\N
5	Providing assistance with construction projects and maintenance of farm infrastructure	\N
\.


--
-- Name: internshipduty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('internshipduty_id_seq', 5, true);


--
-- Name: internshipduty_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY internshipduty
    ADD CONSTRAINT internshipduty_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

