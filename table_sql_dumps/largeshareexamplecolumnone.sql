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
-- Name: largeshareexamplecolumnone; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE largeshareexamplecolumnone (
    id integer NOT NULL,
    content character varying(100),
    "position" integer
);


ALTER TABLE largeshareexamplecolumnone OWNER TO scott;

--
-- Name: largeshareexamplecolumnone_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE largeshareexamplecolumnone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE largeshareexamplecolumnone_id_seq OWNER TO scott;

--
-- Name: largeshareexamplecolumnone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE largeshareexamplecolumnone_id_seq OWNED BY largeshareexamplecolumnone.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY largeshareexamplecolumnone ALTER COLUMN id SET DEFAULT nextval('largeshareexamplecolumnone_id_seq'::regclass);


--
-- Data for Name: largeshareexamplecolumnone; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY largeshareexamplecolumnone (id, content, "position") FROM stdin;
1	1 head of lettuce	\N
2	1.5 lbs tomatoes	\N
3	1.5 lbs eggplant	\N
4	1 lb sweet peppers	\N
5	1 lb beans	\N
6	6 ears of corn	\N
\.


--
-- Name: largeshareexamplecolumnone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('largeshareexamplecolumnone_id_seq', 6, true);


--
-- Name: largeshareexamplecolumnone_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY largeshareexamplecolumnone
    ADD CONSTRAINT largeshareexamplecolumnone_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

