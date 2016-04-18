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
-- Name: csastatements; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE csastatements (
    id integer NOT NULL,
    content character varying(100),
    "position" integer
);


ALTER TABLE csastatements OWNER TO scott;

--
-- Name: csastatements_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE csastatements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE csastatements_id_seq OWNER TO scott;

--
-- Name: csastatements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE csastatements_id_seq OWNED BY csastatements.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY csastatements ALTER COLUMN id SET DEFAULT nextval('csastatements_id_seq'::regclass);


--
-- Data for Name: csastatements; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY csastatements (id, content, "position") FROM stdin;
2	My diet includes a substantial quantity of vegetables	\N
3	I have a desire to eat the freshest and best tasting produce available	\N
4	I want to eat a large variety of produce	\N
5	I have a desire to eat according to the seasons	\N
6	I want to support a local business	\N
7	I have an ability and/or interest to prepare meals	\N
8	I have a willingness to try new foods and recipes	\N
9	I want to eat non-GMO and chemical-free produce	1
1	I want to know my farmer	2
\.


--
-- Name: csastatements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('csastatements_id_seq', 9, true);


--
-- Name: csastatements_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY csastatements
    ADD CONSTRAINT csastatements_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

