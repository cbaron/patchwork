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
-- Name: contactinfo; Type: TABLE; Schema: public; Owner: cbaron; Tablespace: 
--

CREATE TABLE contactinfo (
    id integer NOT NULL,
    street character varying(100),
    citystatezip character varying(100),
    email character varying(100),
    phonenumber character varying(16)
);


ALTER TABLE contactinfo OWNER TO cbaron;

--
-- Name: contactinfo_id_seq; Type: SEQUENCE; Schema: public; Owner: cbaron
--

CREATE SEQUENCE contactinfo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contactinfo_id_seq OWNER TO cbaron;

--
-- Name: contactinfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cbaron
--

ALTER SEQUENCE contactinfo_id_seq OWNED BY contactinfo.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cbaron
--

ALTER TABLE ONLY contactinfo ALTER COLUMN id SET DEFAULT nextval('contactinfo_id_seq'::regclass);


--
-- Data for Name: contactinfo; Type: TABLE DATA; Schema: public; Owner: cbaron
--

COPY contactinfo (id, street, citystatezip, email, phonenumber) FROM stdin;
1	9057 W. Third St.	Dayton, OH 45417	eat.patchworkgardens@gmail.com	(937) 835-5807
\.


--
-- Name: contactinfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cbaron
--

SELECT pg_catalog.setval('contactinfo_id_seq', 1, true);


--
-- Name: contactinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: cbaron; Tablespace: 
--

ALTER TABLE ONLY contactinfo
    ADD CONSTRAINT contactinfo_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

