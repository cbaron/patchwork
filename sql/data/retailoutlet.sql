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
-- Name: retailoutlet; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE retailoutlet (
    id integer NOT NULL,
    name character varying(100),
    street character varying(100),
    citystatezip character varying(100),
    email character varying(100),
    phonenumber character varying(16),
    hours character varying(100)
);


ALTER TABLE retailoutlet OWNER TO scott;

--
-- Name: retailoutlet_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE retailoutlet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE retailoutlet_id_seq OWNER TO scott;

--
-- Name: retailoutlet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE retailoutlet_id_seq OWNED BY retailoutlet.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY retailoutlet ALTER COLUMN id SET DEFAULT nextval('retailoutlet_id_seq'::regclass);


--
-- Data for Name: retailoutlet; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY retailoutlet (id, name, street, citystatezip, email, phonenumber, hours) FROM stdin;
1	Olympia Health Food Store	4077 E. Town and Country Rd.	Kettering, OH 45429		(937) 293-4244	Mon-Fri 10am-7:30pm, Sat 10am-5pm, Sun 12pm-5pm
2	E.A.T. Food for Life	1120 Wayne Ave.	Dayton, OH 45410	dan@eatfoodforlife.com	(419) 336-5433	Sat 8am-12pm
\.


--
-- Name: retailoutlet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('retailoutlet_id_seq', 2, true);


--
-- Name: retailoutlet_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY retailoutlet
    ADD CONSTRAINT retailoutlet_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

