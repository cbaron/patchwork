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
-- Name: largeshareexamplecolumntwo; Type: TABLE; Schema: public; Owner: scott; Tablespace: 
--

CREATE TABLE largeshareexamplecolumntwo (
    id integer NOT NULL,
    content character varying(100),
    "position" integer
);


ALTER TABLE largeshareexamplecolumntwo OWNER TO scott;

--
-- Name: largeshareexamplecolumntwo_id_seq; Type: SEQUENCE; Schema: public; Owner: scott
--

CREATE SEQUENCE largeshareexamplecolumntwo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE largeshareexamplecolumntwo_id_seq OWNER TO scott;

--
-- Name: largeshareexamplecolumntwo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scott
--

ALTER SEQUENCE largeshareexamplecolumntwo_id_seq OWNED BY largeshareexamplecolumntwo.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scott
--

ALTER TABLE ONLY largeshareexamplecolumntwo ALTER COLUMN id SET DEFAULT nextval('largeshareexamplecolumntwo_id_seq'::regclass);


--
-- Data for Name: largeshareexamplecolumntwo; Type: TABLE DATA; Schema: public; Owner: scott
--

COPY largeshareexamplecolumntwo (id, content, "position") FROM stdin;
1	1.5 lbs summer squash	\N
2	2 lbs green cabbage	\N
3	2 lbs potatoes	\N
4	1 head of garlic	\N
5	1 bunch of cilantro	\N
6	and a sunflower!	\N
\.


--
-- Name: largeshareexamplecolumntwo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scott
--

SELECT pg_catalog.setval('largeshareexamplecolumntwo_id_seq', 6, true);


--
-- Name: largeshareexamplecolumntwo_pkey; Type: CONSTRAINT; Schema: public; Owner: scott; Tablespace: 
--

ALTER TABLE ONLY largeshareexamplecolumntwo
    ADD CONSTRAINT largeshareexamplecolumntwo_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

