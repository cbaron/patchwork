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
-- Name: farmermarket; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE farmermarket (
    id integer NOT NULL,
    name character varying(100),
    street character varying(100),
    citystatezip character varying(100),
    email character varying(100),
    phonenumber character varying(16),
    hours character varying(100)
);


ALTER TABLE farmermarket OWNER TO scott;

--
-- Name: farmermarket_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE farmermarket_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE farmermarket_id_seq OWNER TO scott;

--
-- Name: farmermarket_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE farmermarket_id_seq OWNED BY farmermarket.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY farmermarket ALTER COLUMN id SET DEFAULT nextval('farmermarket_id_seq'::regclass);


--
-- Data for Name: farmermarket; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY farmermarket (id, name, street, citystatezip, email, phonenumber, hours) FROM stdin;
1	Yellow Springs Saturday Market	101 S. Walnut St. (Corner Cone parking lot)	Yellow Springs, OH 45387			Sat 8am-12pm, mid-May through Thanksgiving
\.


--
-- Name: farmermarket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('farmermarket_id_seq', 1, true);


--
-- Name: farmermarket_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY farmermarket
    ADD CONSTRAINT farmermarket_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

