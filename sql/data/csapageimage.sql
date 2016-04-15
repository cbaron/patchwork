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
-- Name: csapageimage; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE csapageimage (
    id integer NOT NULL,
    caption character varying(100),
    image bytea
);


ALTER TABLE csapageimage OWNER TO scott;

--
-- Name: csapageimage_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE csapageimage_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE csapageimage_id_seq OWNER TO scott;

--
-- Name: csapageimage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE csapageimage_id_seq OWNED BY csapageimage.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY csapageimage ALTER COLUMN id SET DEFAULT nextval('csapageimage_id_seq'::regclass);


--
-- Data for Name: csapageimage; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY csapageimage (id, caption, image) FROM stdin;
\.


--
-- Name: csapageimage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('csapageimage_id_seq', 1, true);


--
-- Name: csapageimage_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY csapageimage
    ADD CONSTRAINT csapageimage_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
