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
-- Name: internshipqualification; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE internshipqualification (
    id integer NOT NULL,
    content character varying(1000),
    "position" integer
);


ALTER TABLE internshipqualification OWNER TO scott;

--
-- Name: internshipqualification_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE internshipqualification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE internshipqualification_id_seq OWNER TO scott;

--
-- Name: internshipqualification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE internshipqualification_id_seq OWNED BY internshipqualification.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY internshipqualification ALTER COLUMN id SET DEFAULT nextval('internshipqualification_id_seq'::regclass);


--
-- Data for Name: internshipqualification; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY internshipqualification (id, content, "position") FROM stdin;
1	Knowledge of and experience with growing vegetables without added chemicals	\N
2	Strong work ethic and desire to learn	\N
3	Self-motivated and willing to take initiative	\N
4	Attention to detail and efficiency	\N
5	Creativity and love for a sustainable lifestyle	\N
\.


--
-- Name: internshipqualification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('internshipqualification_id_seq', 5, true);


--
-- Name: internshipqualification_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY internshipqualification
    ADD CONSTRAINT internshipqualification_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

