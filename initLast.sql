--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY root.users_access DROP CONSTRAINT users_access_user_id_fkey;
ALTER TABLE ONLY root.photos_by_month DROP CONSTRAINT photos_by_month_user_id_fkey;
ALTER TABLE ONLY root.pages DROP CONSTRAINT pages_user_id_fkey;
ALTER TABLE ONLY root.pages DROP CONSTRAINT pages_chapter_id_fkey;
ALTER TABLE ONLY root.notes DROP CONSTRAINT notes_user_id_fkey;
ALTER TABLE ONLY root.notes DROP CONSTRAINT notes_page_id_fkey;
ALTER TABLE ONLY root.notes DROP CONSTRAINT notes_chapter_id_fkey;
ALTER TABLE ONLY root.diaries DROP CONSTRAINT diaries_user_id_fkey;
ALTER TABLE ONLY root.children DROP CONSTRAINT children_user_id_fkey;
ALTER TABLE ONLY root.chapters DROP CONSTRAINT chapters_user_id_fkey;
DROP INDEX root.diaries_user_id_uindex;
DROP INDEX root.diaries_id_uindex;
ALTER TABLE ONLY root.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY root.users DROP CONSTRAINT users_email_key;
ALTER TABLE ONLY root.users_access DROP CONSTRAINT users_access_pkey;
ALTER TABLE ONLY root.photos_by_month DROP CONSTRAINT photos_by_month_pkey;
ALTER TABLE ONLY root.pages DROP CONSTRAINT pages_pkey;
ALTER TABLE ONLY root.notes DROP CONSTRAINT notes_pkey;
ALTER TABLE ONLY root.diaries DROP CONSTRAINT diaries_pk;
ALTER TABLE ONLY root.children DROP CONSTRAINT children_pkey;
ALTER TABLE ONLY root.chapters DROP CONSTRAINT chapters_pkey;
ALTER TABLE root.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE root.children ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE root.users_user_id_seq;
DROP SEQUENCE root.users_id_seq;
DROP TABLE root.users_access;
DROP TABLE root.users;
DROP TABLE root.photos_by_month;
DROP TABLE root.pages;
DROP TABLE root.notes;
DROP TABLE root.diaries;
DROP SEQUENCE root.children_id_seq;
DROP TABLE root.children;
DROP TABLE root.chapters;
DROP SCHEMA root;
--
-- Name: root; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA root;


ALTER SCHEMA root OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chapters; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.chapters (
    id character varying(256) NOT NULL,
    diary_id character varying(256) NOT NULL,
    name character varying(64),
    number character varying(28),
    server_created_at timestamp(6) with time zone,
    server_updated_at timestamp(6) with time zone,
    server_deleted_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone,
    updated_at timestamp(6) with time zone,
    user_id bigint NOT NULL
);


ALTER TABLE root.chapters OWNER TO postgres;

--
-- Name: children; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.children (
    id bigint NOT NULL,
    user_id bigint,
    name character varying(50),
    gender character varying(10),
    birthdate timestamp without time zone
);


ALTER TABLE root.children OWNER TO postgres;

--
-- Name: children_id_seq; Type: SEQUENCE; Schema: root; Owner: postgres
--

CREATE SEQUENCE root.children_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE root.children_id_seq OWNER TO postgres;

--
-- Name: children_id_seq; Type: SEQUENCE OWNED BY; Schema: root; Owner: postgres
--

ALTER SEQUENCE root.children_id_seq OWNED BY root.children.id;


--
-- Name: diaries; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.diaries (
    id character varying(256) NOT NULL,
    user_id bigint NOT NULL,
    name character varying(64),
    server_created_at timestamp(6) with time zone,
    server_updated_at timestamp(6) with time zone,
    server_deleted_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone,
    updated_at timestamp(6) with time zone
);


ALTER TABLE root.diaries OWNER TO postgres;

--
-- Name: notes; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.notes (
    id character varying(256) NOT NULL,
    diary_id character varying(256) NOT NULL,
    chapter_id character varying(256),
    page_id character varying(256) NOT NULL,
    server_created_at timestamp(6) with time zone,
    server_updated_at timestamp(6) with time zone,
    server_deleted_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone,
    updated_at timestamp(6) with time zone,
    title character varying(64),
    bookmarked boolean,
    photo text,
    note text,
    tags text,
    user_id bigint NOT NULL
);


ALTER TABLE root.notes OWNER TO postgres;

--
-- Name: pages; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.pages (
    id character varying(256) NOT NULL,
    diary_id character varying(256) NOT NULL,
    chapter_id character varying(256),
    name character varying(64),
    server_created_at timestamp(6) with time zone,
    server_updated_at timestamp(6) with time zone,
    server_deleted_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone,
    updated_at timestamp(6) with time zone,
    user_id bigint NOT NULL
);


ALTER TABLE root.pages OWNER TO postgres;

--
-- Name: photos_by_month; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.photos_by_month (
    id character varying(256) NOT NULL,
    user_id bigint NOT NULL,
    diary_id character varying(256) NOT NULL,
    photo text,
    date timestamp(6) with time zone,
    server_created_at timestamp(6) with time zone,
    server_updated_at timestamp(6) with time zone,
    server_deleted_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone,
    updated_at timestamp(6) with time zone
);


ALTER TABLE root.photos_by_month OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.users (
    id bigint NOT NULL,
    name character varying(60),
    email character varying(256) NOT NULL,
    password_hash character varying(64) NOT NULL,
    diary bigint,
    pregnant_date_start timestamp with time zone,
    pregnant_date_end timestamp with time zone,
    confirmed boolean DEFAULT false NOT NULL,
    code character varying(64) DEFAULT NULL::character varying
);


ALTER TABLE root.users OWNER TO postgres;

--
-- Name: users_access; Type: TABLE; Schema: root; Owner: postgres
--

CREATE TABLE root.users_access (
    token character varying(128) NOT NULL,
    user_id bigint NOT NULL,
    device character varying(128) NOT NULL,
    expires timestamp with time zone NOT NULL
);


ALTER TABLE root.users_access OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: root; Owner: postgres
--

CREATE SEQUENCE root.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE root.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: root; Owner: postgres
--

ALTER SEQUENCE root.users_id_seq OWNED BY root.users.id;


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: root; Owner: postgres
--

CREATE SEQUENCE root.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE root.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: root; Owner: postgres
--

ALTER SEQUENCE root.users_user_id_seq OWNED BY root.users.id;


--
-- Name: children id; Type: DEFAULT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.children ALTER COLUMN id SET DEFAULT nextval('root.children_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.users ALTER COLUMN id SET DEFAULT nextval('root.users_id_seq'::regclass);


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.chapters (id, diary_id, name, number, server_created_at, server_updated_at, server_deleted_at, created_at, updated_at, user_id) FROM stdin;
eiawp61ss6yjl0gv	u00u2xvzrhbt0nmj	Чаптер	I	2021-11-01 15:23:10.622588+02	2021-11-01 15:23:10.622588+02	2021-11-01 15:24:48.092934+02	2021-11-01 15:23:02.049+02	2021-11-01 15:23:02.049+02	1
\.


--
-- Data for Name: children; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.children (id, user_id, name, gender, birthdate) FROM stdin;
\.


--
-- Data for Name: diaries; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.diaries (id, user_id, name, server_created_at, server_updated_at, server_deleted_at, created_at, updated_at) FROM stdin;
u00u2xvzrhbt0nmj	1	\N	2021-11-01 15:13:52.580078+02	2021-11-01 15:13:52.580078+02	\N	\N	\N
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.notes (id, diary_id, chapter_id, page_id, server_created_at, server_updated_at, server_deleted_at, created_at, updated_at, title, bookmarked, photo, note, tags, user_id) FROM stdin;
0d8e4bjwskqktc6f	u00u2xvzrhbt0nmj	\N	35a6zesl7dck73ao	2021-11-05 14:45:54.024996+02	2021-11-05 14:45:54.024996+02	\N	2021-11-04 14:25:20.966+02	2021-11-05 14:27:27.088+02	Новая запись123 	f	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_1ae03e49-539e-4893-9f10-f72f864b8947.jpg;file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_8bc63279-7a71-440e-a953-5b36d99adc3a.jpg	<div>123</div>	\N	1
kki2s7lthp3plil1	u00u2xvzrhbt0nmj	\N	35a6zesl7dck73ao	2021-11-05 14:45:54.024996+02	2021-11-05 14:45:54.024996+02	\N	2021-11-05 14:19:18.809+02	2021-11-05 14:45:13.626+02	Тест записи 1991	f	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_307439d9-09d4-461d-9efa-e73972662516.jpg;file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_b3f66168-aeb3-4000-9d6d-da319217c7c4.jpg	йййцфото	\N	1
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.pages (id, diary_id, chapter_id, name, server_created_at, server_updated_at, server_deleted_at, created_at, updated_at, user_id) FROM stdin;
xz2zbvezduymq5io	u00u2xvzrhbt0nmj	\N	Йцу	2021-11-01 15:20:31.882834+02	2021-11-01 15:20:31.882834+02	2021-11-01 15:22:23.872347+02	2021-11-01 13:38:36.642+02	2021-11-01 13:38:36.642+02	1
izuxs3r26zqbb0nx	u00u2xvzrhbt0nmj	eiawp61ss6yjl0gv	Заг	2021-11-01 15:23:10.772687+02	2021-11-01 15:23:10.772687+02	2021-11-01 15:24:48.092934+02	2021-11-01 15:23:02.049+02	2021-11-01 15:23:02.049+02	1
savufer0cq32622i	u00u2xvzrhbt0nmj	eiawp61ss6yjl0gv	Лд	2021-11-01 15:24:26.393161+02	2021-11-01 15:24:26.393161+02	2021-11-01 15:24:48.092934+02	2021-11-01 15:24:07.057+02	2021-11-01 15:24:07.057+02	1
c886lgjfrjctxyxq	u00u2xvzrhbt0nmj	\N	Йцк	2021-11-01 15:46:03.270608+02	2021-11-01 15:46:03.270608+02	\N	2021-11-01 15:45:37.176+02	2021-11-01 15:45:37.176+02	1
35a6zesl7dck73ao	u00u2xvzrhbt0nmj	\N	Qweertt	2021-11-04 02:00:16.473116+02	2021-11-04 02:00:16.473116+02	\N	2021-11-04 02:00:09.532+02	2021-11-04 02:00:09.532+02	1
\.


--
-- Data for Name: photos_by_month; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.photos_by_month (id, user_id, diary_id, photo, date, server_created_at, server_updated_at, server_deleted_at, created_at, updated_at) FROM stdin;
j6x4h14xtl3z5gyl	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_ac3bde6a-e0d0-4c37-8b80-d205ca04fd74.jpg	2022-05-04 18:14:24.553+03	2021-11-04 19:54:35.600233+02	2021-11-04 19:54:35.600233+02	\N	2021-11-04 18:14:24.553+02	2021-11-04 19:41:21.067+02
qelspyyls3t97g3y	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_961a88d1-f2c9-4e46-8254-6e39065d81d2.jpg	2022-06-04 18:14:24.553+03	2021-11-04 19:54:35.600233+02	2021-11-04 19:54:35.600233+02	\N	2021-11-04 18:14:24.553+02	2021-11-04 19:44:43.086+02
i3q4uyhcqalg7dwp	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_1192c4e4-cdcb-43c1-9684-1f7d5500096a.jpg	2022-09-04 18:14:24.553+03	2021-11-04 19:54:35.600233+02	2021-11-04 19:54:35.600233+02	\N	2021-11-04 18:14:24.553+02	2021-11-04 19:54:29.755+02
6onn2a37g4rw4mar	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_5e62aee2-9e30-410a-9a83-56c8350d3500.jpg	2021-11-04 18:14:24.539+02	2021-11-04 20:29:41.824595+02	2021-11-04 20:29:41.824595+02	\N	2021-11-04 18:14:24.553+02	2021-11-04 20:29:03.332+02
ekty5vtclcbduebx	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_640ec05f-5e35-408d-bd7e-48a3c1fbf69b.jpg	2022-10-04 18:14:24.553+03	2021-11-04 18:17:00.155055+02	2021-11-04 18:17:00.155055+02	\N	2021-11-04 18:14:24.553+02	2021-11-04 18:16:53.994+02
u4k9btfmmq6i1vqc	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_237c28ff-a1e4-41c0-9ead-8e22b742c96b.jpg	2022-03-04 18:14:24.553+02	2021-11-04 20:29:41.824595+02	2021-11-04 20:29:41.824595+02	\N	2021-11-04 18:14:24.553+02	2021-11-04 20:29:21.221+02
h0d0vig4jzck4fxu	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_24838f60-9a7b-4259-a131-6146c0562355.jpg	2022-08-04 18:14:24.553+03	2021-11-04 18:22:51.905418+02	2021-11-04 18:22:51.905418+02	\N	2021-11-04 18:14:24.553+02	2021-11-04 18:22:46.489+02
2hk9lqfr963n1vxl	1	u00u2xvzrhbt0nmj	\N	2021-12-04 18:14:24.553+02	2021-11-05 14:19:34.359632+02	2021-11-05 14:19:34.359632+02	\N	2021-11-04 18:14:24.553+02	2021-11-05 14:17:54.627+02
873gwfd89w14uydd	1	u00u2xvzrhbt0nmj	\N	2022-01-04 18:14:24.553+02	2021-11-05 14:19:34.359632+02	2021-11-05 14:19:34.359632+02	\N	2021-11-04 18:14:24.553+02	2021-11-05 14:17:51.103+02
k05nffas9ctidf30	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_249e8f38-0e2b-416b-82a1-55c425bb81b4.jpg	2022-07-04 18:14:24.553+03	2021-11-05 14:49:09.664803+02	2021-11-05 14:49:09.664803+02	\N	2021-11-04 18:14:24.553+02	2021-11-05 14:48:49.646+02
tk75usnne0xpdfnr	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_2cf3bfb9-4cb0-4ef6-aa7b-33b2ba052854.jpg	2022-02-04 18:14:24.553+02	2021-11-05 14:53:21.474724+02	2021-11-05 14:53:21.474724+02	\N	2021-11-04 18:14:24.553+02	2021-11-05 14:53:04.704+02
b0cs2us8x7whu022	1	u00u2xvzrhbt0nmj	file:///data/user/0/com.rntempl/cache/rn_image_picker_lib_temp_f5ec2c79-3914-4901-b913-8fd9ab0fef4d.jpg	2022-04-04 18:14:24.553+03	2021-11-05 14:59:02.997369+02	2021-11-05 14:59:02.997369+02	\N	2021-11-04 18:14:24.553+02	2021-11-05 14:57:53.209+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.users (id, name, email, password_hash, diary, pregnant_date_start, pregnant_date_end, confirmed, code) FROM stdin;
1	\N	app.mikhail.kovalchuk@gmail.com	abfbabb9072bc4b30d55fb0cdde5452da653b1a67fe530a7c8bd76071add3ffc	\N	\N	\N	t	\N
\.


--
-- Data for Name: users_access; Type: TABLE DATA; Schema: root; Owner: postgres
--

COPY root.users_access (token, user_id, device, expires) FROM stdin;
554b8a057d517a729251a1aead8d4998a2a0f48ec5ad3aae170ce4e3f1bc976062600bb5ae08a1d24ff6c7ca7b8ec65fd2aad56c6cfd27d626fe82f7b3da23df	1	mobile	2021-12-01 15:13:52.540917+02
48858a956aa2cd779051377aacb4f6193513f8872e12d5446033f29ec5bd25ce648972b02c292971504c2ad0619d4c9f72d98f3d24f4f3f3c7e636eb29d68bec	1	mobile	2021-12-01 15:18:35.233315+02
b21a328189785e537250f8307e0917d13302c98588e5108a21900c318ec7f25cb32554585a6e29e8d672ccca203fbda2f6ac2bb8cafca3e07191edb34619b5ea	1	mobile	2021-12-01 15:20:31.192003+02
a7d618758ad93080c4ae7804cd3a74d07c3baefcd22811d135a8372400d7481a19179c24f79515bfe5cda365cb824130934e10f4b80d4cb74a3f6ca67ec325bd	1	mobile	2021-12-01 15:21:41.724542+02
cc1236625195dc7ef631b96dce5f6e30152bcfe4ec23e6b54117fde97a805abc11aace97a7f5896943443257a2f76128fd96d724dfa99cd69365b32d218edf16	1	mobile	2021-12-01 15:22:23.527824+02
23e91639099dabf04a77576bb54568084771308ca34eb91216e951f7a98c21a5aeb6d0aaac4a3ccd303f9a8b3d480a00b53445ebb4efc1b0e992471024227518	1	mobile	2021-12-01 15:23:10.215438+02
9418ca7cf15f49f711b036978716a1bfde117cab660a04812ec71f2f59d4f3fba1cf0d9c1b63f4cdf764af62ae2b02b586cd23f7184a715257ae5fa6ee178974	1	mobile	2021-12-01 15:23:42.170969+02
696e2046cba5786f0bfb0479ae1812db579b2577166724863e1d89d32f72f0bc7b3498458a20e3f7fb6b43c098ff16d7980686644083ad57a221f62f4586678f	1	mobile	2021-12-01 15:24:26.03631+02
e56703e496c0e43841cbbe0eb5d771055e7e8bcdeff7be84dc1cec3c6ed0b47b9301c37525f16b25f54ae9722315affd794726ac9b0d99488901cb06f964f0fd	1	mobile	2021-12-01 15:24:47.687632+02
ff863c5acd726382edbc2395a0efe7abb9a1e893dff029a225d04f7fd0a8cc69fd3b05a899e75f0c33a672696a9e6ebd7f13ba248ea60a7a637fe149d943967c	1	mobile	2021-12-01 15:25:58.42643+02
967702e3531dd1afaed5ef8eb20a0f7b6d6739cc3557b5185f28da7ea34d93b4abad948863a7cf70c4a04dc3ee28a0dc877f1aef44f27f393b485f39e4ac4265	1	mobile	2021-12-01 15:28:57.658742+02
1babe9724141e508339f5149047e421482eb7da24b3eb0b8bde7a5b212bbb57977e22f593d52865d856b1226ca5c9ed2b56f1ed1c717abb870e378b8ca21c8e6	1	mobile	2021-12-01 15:30:17.028899+02
4197e9e90ea5df309510df4209b20c90c7e08d4d002660a6944b4d7e3fe41d96f75423a4d72a168d3ce4aeccadf11acbfc4900c6078e160b38f0d1682d1b7338	1	mobile	2021-12-01 15:33:01.112919+02
568bd55440b715fcd03fc20dfe692f19bb78e075d2cef7b74df839f9e8a4b2ebedaf44059ce4840862f2fc331fc20df9ecc54a7e29b637c8e17aabbf8eac596e	1	mobile	2021-12-01 15:46:02.794285+02
7bccf7b726cf03d66a3984191f63e3b0a1fb5e725e59e59b7ea932409ff0276792b6496bd7b99bc6b39a2f9080d8e087a7dece091a022bee326aa2e8b6d9764c	1	mobile	2021-12-01 15:48:30.948643+02
4c527ff5c2e060d71449c94fc74398e45996ddcac06b4c10d057c39191546107f88256eabe46fb8d8aedc597d45d5f8e4024eae65617ae07d1c3140b6e7e9b2d	1	mobile	2021-12-01 16:11:55.227621+02
e4c0fe8b230dbf7a7626582135b304315809bf27f5fa393b556823f2762dfd00b007e9748a4f2b4c1379782e451f1178908e320c85e53ad8f791add83a0c7575	1	mobile	2021-12-01 16:12:08.184805+02
9d34b3262c51169bdbac846cc3d25b1eba737451b7ff82b7746df3dacaf9043e90f9ceb9990b4ed4dfe9812ada0a6dd982b1086fa02ce64c4d7df33a42dcf4cc	1	mobile	2021-12-01 16:13:38.132619+02
743a8817ae542d6a339385aeeaaefb9986d36a75f74358708584809390c8fd8d62ebb5beb82a3ea2ecd073293d1aca5adf2b36b83ccd8228815838a455d77335	1	mobile	2021-12-01 16:14:51.715391+02
9018ef7a92b34a36130590f2a943a3e9dd72499b373925f30153f9558d10a66d4517888284e46738dd5fe3d32a5464f973a7d4aa1026c4eae4e966c6ca314993	1	mobile	2021-12-01 16:37:35.429569+02
9639a015d505ad73a27955cc2dec39d0a3b1c59af372fc96bd541a800d24b7c9a62b46a041d0bbd8369cb9d70e6395e539a705baa50eafa2a3eea989dba72d30	1	mobile	2021-12-01 17:02:08.132564+02
007dd509838da79f2a577fbd4a8adae8933296b79868855bb912f11b7af576c3b833cc4cdcd285bd21cf6e9c9bb5e1d26f789ad5e728655d34efe06a3b9e98be	1	mobile	2021-12-01 17:03:19.893104+02
6da034594d64796ddfbfe14ba015edf329cef527ad2f7921cac7c98f5f657c8e2f3df94e4ae06b67cbcacb569d01665d457d899b62745b995298bf10a1d4b094	1	mobile	2021-12-01 17:04:49.173253+02
860c0b07c10ea4e57c8ba75ad96db27fcd09c047cf5b6bfd2011f56b291b3f85bb6c6ac957ec53bcafa5fb5a6943ffb29dbd28100f512b315a44ad567e902304	1	mobile	2021-12-01 17:36:56.402278+02
a52b4df7b848e60a803596b2eaf0cd2a9e76a52d57c24fb278aae3ae10fbec1176f0b83d7e6aecf1d82836e04f1bc2da4e089689e4d25b23c553e4ee46508841	1	mobile	2021-12-01 17:44:11.810397+02
806995b3176eb612b283cdb54e66edfc88c7b142c935fe9e4e267783f81f5e6c847a2b209e4c3c235857f3cf57d80153a9214e34cb9e7c410b71745072d7b8f3	1	mobile	2021-12-01 17:59:45.785085+02
e281c71e5f7f73997345f1a18f0fbcb8d99ea53aa4816059c053d6bd9ebfa1d1d6449375b204870b270cce6b670eeb4ce61ea002557d857b77850ae305befb02	1	mobile	2021-12-01 18:03:02.246303+02
0d5ed4e098506e429b613470cdb8506bd22b9684ead8eed330fe280f5adcdde58770a154d54df4c2131a9c21d37062101c9ad4daa7cf643417ac1d568998c548	1	mobile	2021-12-01 18:11:02.406474+02
5544d91a05f6871e9692b879b565a40902002106fca8f9dfd3b2b0072c8b59c1cc0c43b4f1c3f105185ac007ce05dea9a475951cdba89edbb97c10f35c637a7f	1	mobile	2021-12-01 18:14:48.325971+02
711ce0a2d60943c28bca1359cefa83296ba2ee349a0fa269db4a4fe70be149f93aa51795a09c7810a92d57265d85edeef5e7f3c15d92e2ca059e24d42447e42f	1	mobile	2021-12-01 19:02:54.491701+02
2812cf81d03f3b69e1d709e87a6143ada8f8581088ee66eab4b0ee22d623998130a4425461898cda030c12921504d0f860bd3cdf43c9a5c0192f489583f70de1	1	mobile	2021-12-01 19:03:10.156558+02
40b411ea7a461a8eb99c6743152720c53b67d28572ac96bb4a8dbd7d535048f2e37e0a2f856ff2981900a3fb2a59a32e25c870a76abad9e71d90dcb1ee3494bf	1	mobile	2021-12-01 19:09:53.007266+02
5400b7877fd4bffa513625491559b2e898528acb30cc7ee047f5fc4f16385d14a7322c169863f4fbdac997f1b15a338bae5889519b5824812fa3ee65e75d06dc	1	mobile	2021-12-01 19:24:35.548806+02
8a717bd9ca4ca4ec0085ab0407fda1b82a03f38052727b487316d00eff5ea17f08a6c85096d6352e02953d5620ae866ff220a20d9db57f38af9719d3fccf646c	1	mobile	2021-12-01 19:35:25.899941+02
1e2552f35c71f9ff3804e039479e71317938b0de8d30fa6c2c3e5413453bf004448a37670ff4459bd29ef1251b3b6e60d0dc4e88b42e3290bc55e1b5fc1218c4	1	mobile	2021-12-02 15:15:13.509087+02
781fe14daad3433239fffb84c4c74582e7d1c3ccf1973325b2a549d1add0b71e9eec429741737afda912bf859ce0d659ab81428f2e16128a851c2c52a718d4fd	1	mobile	2021-12-02 15:18:11.980556+02
6939d725f37d26b28d4d5b34d56a2c36e5326bed6a91e425477b0004be1b2e2cea1f1451273748f88e3b59972ed2bb6af5ace17de48aec2cb48e6da70d04e4c9	1	mobile	2021-12-02 15:18:42.097272+02
dca8d0a51cbe5d5b32a04371f0d9fcdbbb2de2b35ea8da8bafb95ec40cc3dd360cb5eed3c85048f90eda0127b8bc65d68a4c74e8d39cc906a2c2f09292320797	1	mobile	2021-12-02 15:20:28.425541+02
31182963c5591bd404ec50d64819dc0fd3822ffd3de2b8d0de6da117097432b5a3a4c75770ef6216761740e8b1c26811bbf907ad91fc4438e876199ae689e783	1	mobile	2021-12-02 15:24:39.30589+02
90121f6a51f4a4fca72ffe60d2f0f8470c9c2a390937e603d41059177a8d4efb32316c30ea8de34a1cb2eb0992802f6ecdb5779b798167f502e53a64b5d358cf	1	mobile	2021-12-02 15:27:42.251337+02
9ab464fe335eae183f765792b2005bb8ad03de4050d1abdde9753727ffbc62a805edb11bc1657499a3e2194afa15f9d8385d143278c98499340a82fc2aa3c8ee	1	mobile	2021-12-02 15:29:30.192482+02
e442c6f09cbf1695976cf77ddc91548fbee1cc4c237076888582263a09136c213b9503fcdf147c4d200cfde3db1ff3732e7c27c312acc559d83461ba4ebd013b	1	mobile	2021-12-02 15:30:22.562143+02
24d2ec5ce3d0eee0aa0bddadf4be496172b2782c5878bdf82316ffe3b775e89a4fc27719efc0b75e9e7b19c5ad32f062972eb21c5087994aadda610c89ad2ba1	1	mobile	2021-12-02 15:33:25.711174+02
4e1982397f8e36c65ef2ccc18163cc60f45aef2ce3e70ed9001261d54010407c80e18c94a9ab2e61927612fab478a44051774a3497cb43719639b3ace295b8b6	1	mobile	2021-12-04 01:23:48.957816+02
c3c08e5f8554a0c7984fe98956f4e90a3c46422a3ea52d850ec2c10c1036928f478dead9dd4cc58deadebd0e4938169ca4c87ee051289b332091453671f92610	1	mobile	2021-12-04 01:44:55.527085+02
179bb532aa4d75d7e95dffad7b7c53aef9686b5b1bb303f7a1100307ba50c59a1d3b2fb6e5007be03140319c5c428d81d785ddcb5081dfff30d8240a907055b6	1	mobile	2021-12-04 01:49:13.35922+02
7592cf0505d6dfd945c44ad52592c3dc0b22a06e0ea1e98e967c543769cec9c2d6fd0a4f1294dcfbdb63d12bf4ff79d472fbc14718e987e8f066e11e077a7678	1	mobile	2021-12-04 03:53:41.946203+02
df9a6bf6c0e029f4cc33ee78e513ef46de3cab157f66d4ea56d6b7776ca652ac1525acb6c9a8029a127201f4190e219b65b4ccb7e3133f5dcf1ff2092b3cbc01	1	mobile	2021-12-04 04:09:32.935442+02
000de9dd70edc3d2fcd06c325c47b1582db042e934b6dadab63c002e47274e249dc28bc28853af8d37aae7639a4dfec68d7fcb33c75ee0bc6cc0172b86ace8a6	1	mobile	2021-12-04 17:07:15.287362+02
6d8873008a00eb7cba3fc05fb8428126b65527a96a6226be3492823c08aa3b1e03fcec903a32c0c624ca41bc3513769339fb8d49ebbdb6f423268c23f25f3027	1	mobile	2021-12-04 18:04:30.907211+02
02c4c71e6a7e3948fb084072d8997beb6f7b60b555fc2b63c86a7d87f6197c3c691c6114d4c6189d61c9faef0cc7dde356fb7856069c1378ef96a45ec0e104aa	1	mobile	2021-12-04 20:05:03.061197+02
76b907798a74267416b33c835d9d4f64134a9cfe913772c29211cafca83dfa82554fdb64d2a3f77726ff51bc60ea2e6f5b2e12b690be9a91a7c531c641c73711	1	mobile	2021-12-04 20:43:20.431105+02
29e6837b73cb972e74ebb2ebd8af8d9e37c1f80d4894078878b2f56fa1f5cc98057d29fbdaf07b7948471c72ffa4382982337fbc762da8ebb8840697a681f4b0	1	mobile	2021-12-05 15:46:00.584432+02
c4f4d3b1c06f79bee008bbb6b56d2aba46db9982f3bc39b90d0aa983a89340589e0c8026744ced954575d5214377c60260365b8339c45454a86aa90221beff49	1	mobile	2021-12-05 17:03:42.78475+02
07dc9d3d657177e7f2fbb41cf7444721294338b17f5c2947983429e72036224d1408b1a9d9b65e966e2707268160206868cedd50e595fa5ae954866882967d04	1	mobile	2021-12-05 17:03:43.046405+02
1c7ec1cf8e7bb5d5872efd463838119c6654107bab77e876ccdd07cb98b4caaa03ed95667328df56bffdd151376d20c3b927699b3ca9e980c36ab3ebb163d3f6	1	mobile	2021-12-05 17:03:43.258797+02
85b0aeaee5247de38f90c6ba64cf26398f07224521c2a0ecd327d84b92646cd60beaf00d6942574c9273563d809fc24d39a2d1f0948d242cbc0c1fd9509af268	1	mobile	2021-12-05 17:03:43.55171+02
b2663eb9968b194b03dacd49409df8d9616845b23c143b90df9be75dc2b0e23c76537e00752640f65723c0ead60786db3c38646f7cb9377d7134fedaa1004e11	1	mobile	2021-12-05 17:03:44.05797+02
cb5d4be509fd2b46b5aabf9a8fe339604f459713c31ce1b5d98ee807e780f0c90f9cad93ba5a2d0b7ac55f094825be572ddca591ea1d4c315e3e52c718ccee54	1	mobile	2021-12-05 17:03:44.505371+02
8316dc3744b35c5716cb7077ae11d480b7515a050267f3b8a9fad4293d1174caab5b08e25faf79e90111c00c7b04d25b365acf8a476ffae0190a345e76ccd1a4	1	mobile	2021-12-05 17:03:44.814078+02
9d182b0386e8c869c2f33f0f831570f3394acc1d1a4e73862f34b30aafa0036aafcea342c87ba1bd3805de2a0a1501bc05022aa137bc52c7c6745a5d80d51400	1	mobile	2021-12-05 17:03:45.22126+02
23a3697b92d900534c7516baf38031690016855f7fbb6c69459af98c835ce9c26a838276dcf9cd632d5997ab0daac63e515aa607c77cd7ee41b216f05d3410e6	1	mobile	2021-12-05 17:03:45.528243+02
ca578b92e50eef2c9376e3857ffedfd76042c57b574033e55685ceae7bd17f77bedbd3a546247fba192d6ed624483f256a178976d9d423914d487ee925468a65	1	mobile	2021-12-05 17:03:46.040114+02
da0fc49650d73baeee5b4c156a634f221fd9e7a5d40a179c66679e1f9561248767f35cd230c749986b92224437bea79d499af54c6610dab6695f030b97025816	1	mobile	2021-12-05 17:03:46.19896+02
7857ed01ebd1319f63678498c439fd5e1ca0ac64ddbdb4fdcf1864aabaefef0b6bbb5690dffd15ee443fc4928023195ea6977a2d65f4feab7d3dedbfd065710b	1	mobile	2021-12-05 17:03:46.552711+02
d715bca759c888069e2ac0e357b6d3578914851139ca53669d084ae03ac3961d5aad03272bbdc48e63d8ebd2891afd9b578d6205a1447a29ae33da28972a16c8	1	mobile	2021-12-05 17:03:46.830123+02
9823445be93673c4f95808383dd272f17081e683c68c3754a1b61d6478af741e4de98f9abf09c552d90ae425f835b428e0377ac18ee0ead72baab1523ac6ced5	1	mobile	2021-12-05 17:03:47.058919+02
09c26a8f1e064a98f239070e881d0a28cf2dffe9fe18a74eeb9dad935fb1696d6c7a3842ba37c3ebbec92d1d7ff72bdb123b12b6a4f81c906329bb5f85ab4321	1	mobile	2021-12-05 17:03:47.189222+02
5e1dddda2224211f293791ac8e97eefa45a731ea395d9fc3d2f277845add7a633dcfbcf0297a23087c471a0771b99ae6108eede314bcb13ab00d093c0f391ef4	1	mobile	2021-12-05 17:03:47.455364+02
cce16b39befa3be06f105368434c183024735f3c54086721a0aa2ce3d14740f1572c428e6e9d761ceb3cd9ca268ecaf6d8a76adde4c77bb29ca722e2d3f326fa	1	mobile	2021-12-05 17:03:47.459037+02
c5f3b4976933e52033db779241fb1596dc3d348c618295b5858f9c899ed38e96edfc2e03c13ed207ecbc6cb2f82ab366b23e988359e41723f8f4a7ac56b0e96b	1	mobile	2021-12-05 17:03:47.886662+02
475838bdd1bd76cab7e13c64fee520de96172c58623f9dc2a997c9503829aed09edb6dc4d033b25f027651bbe56bf7623c98c96ccfaeb74418e9dfa6fd3101ac	1	mobile	2021-12-05 17:03:47.933451+02
a465156ce0b764d1720040cdf5a58562ac98ea1ea7fc89c916b7c37144439a59750c28e8b9d3ff03b33e4240cf1ac516602e19bdac6d0abfc1c9d4cad07e582a	1	mobile	2021-12-05 17:03:48.518674+02
dbf2850472aad621f59848b3747a39003456b101e6f683643e57b8469043e59edbcd2a4a458b5510a1832b02f5472431bc89f7d9474c6295c88bf11f99cd3821	1	mobile	2021-12-05 17:03:48.728495+02
fef5359ecf9dd721b94fc7b343a81a24b375d75ff99fed8a292caa63aa00dc6f8b8b56012b567c6dbb65ce3ee7f63cb96ff9c9af6bdd4c599aed02c2fe269cc9	1	mobile	2021-12-05 17:03:49.008867+02
654ce138743997b51b9f1f3d6f70255873a7b6123cde5d86aa5a9f7e1b7bd85c8b1d2b4ac73e713605ad22f7b9478d3fed1683e6e46e2428c98c1cdba0c81db7	1	mobile	2021-12-05 17:03:49.339016+02
cbca5113255360f62b948d1ebb9301c0dc05254dbad0e4fd90f24ccb605d2054ae8eef28907bd1afbeaa3904a49f30e4ee7f14380264a596249585aac3deb160	1	mobile	2021-12-05 17:03:49.658522+02
d7b82a60fa907ef5b46834468cdcc1e09b7f3b080b754be1661596619fe47ddf2103e19513d9e453c5a9b6c6b49f215401cc69093972bcdf95709c9a799db396	1	mobile	2021-12-05 17:03:49.889194+02
d16b0aa0cbecbf12c4be36c74edd0a00499f7e94944c97fd6f2d08b5c3a1edce206819e5e75edaa6605440733988716a79458692186897fc663f678b02599b10	1	mobile	2021-12-05 17:03:50.239299+02
2371c90f8dae316978d96381f07846df43f2d686c581d1859457a76f30668d665e7445d81631371b44caba70da9bc3809a447de6a60ae57721882f8de4ef6ba0	1	mobile	2021-12-05 17:03:50.551652+02
e19f1468290802f92a854f1433cf4d3adaaed135025c807cf3a499455ab6db582191b1ad1cbc14f38dc8c11d15da71e077ed14f99107c37db8e394c66f8eb50e	1	mobile	2021-12-05 17:03:50.709112+02
4a0e35c32de3750b99aa0b90452d9d3e9e0d55b2ce4f844931cc7e2a9435fc4d47c8ba31127959aa22dba04c663bdcde3bbd43dae392190a85370361b30ab452	1	mobile	2021-12-05 17:03:50.818692+02
7d2f788351fd7f8a84360d2d07bb4749518316d023b010b93679dbdcd3e56015675cfe6039a1281a24060d6d63940672b46b6f501e8cbedb5225db28c92fa4d1	1	mobile	2021-12-05 17:03:51.877163+02
4c1cfa3d468a7bec63e6084c3db8c841d9b98e6d1251c4526342e2ede7276d12245e33abeef87814c344aeb0c51f8c09ada746aaf673779016671f5a601118c8	1	mobile	2021-12-05 18:21:46.674909+02
cbba76bd7038ec4255422ee4f9fef774e7d9fcd0041baeb800ef9cddde1746686207c55d2b0b3c211a8d473e1a4468aeed7c3d885ea54a4f5cb32ec86cc03d61	1	mobile	2021-12-05 20:13:04.170564+02
\.


--
-- Name: children_id_seq; Type: SEQUENCE SET; Schema: root; Owner: postgres
--

SELECT pg_catalog.setval('root.children_id_seq', 20, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: root; Owner: postgres
--

SELECT pg_catalog.setval('root.users_id_seq', 1, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: root; Owner: postgres
--

SELECT pg_catalog.setval('root.users_user_id_seq', 51, true);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- Name: children children_pkey; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.children
    ADD CONSTRAINT children_pkey PRIMARY KEY (id);


--
-- Name: diaries diaries_pk; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.diaries
    ADD CONSTRAINT diaries_pk PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: photos_by_month photos_by_month_pkey; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.photos_by_month
    ADD CONSTRAINT photos_by_month_pkey PRIMARY KEY (id);


--
-- Name: users_access users_access_pkey; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.users_access
    ADD CONSTRAINT users_access_pkey PRIMARY KEY (token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: diaries_id_uindex; Type: INDEX; Schema: root; Owner: postgres
--

CREATE UNIQUE INDEX diaries_id_uindex ON root.diaries USING btree (id);


--
-- Name: diaries_user_id_uindex; Type: INDEX; Schema: root; Owner: postgres
--

CREATE UNIQUE INDEX diaries_user_id_uindex ON root.diaries USING btree (user_id);


--
-- Name: chapters chapters_user_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.chapters
    ADD CONSTRAINT chapters_user_id_fkey FOREIGN KEY (user_id) REFERENCES root.users(id);


--
-- Name: children children_user_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.children
    ADD CONSTRAINT children_user_id_fkey FOREIGN KEY (user_id) REFERENCES root.users(id);


--
-- Name: diaries diaries_user_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.diaries
    ADD CONSTRAINT diaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES root.users(id);


--
-- Name: notes notes_chapter_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.notes
    ADD CONSTRAINT notes_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES root.chapters(id);


--
-- Name: notes notes_page_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.notes
    ADD CONSTRAINT notes_page_id_fkey FOREIGN KEY (page_id) REFERENCES root.pages(id);


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES root.users(id);


--
-- Name: pages pages_chapter_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.pages
    ADD CONSTRAINT pages_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES root.chapters(id);


--
-- Name: pages pages_user_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.pages
    ADD CONSTRAINT pages_user_id_fkey FOREIGN KEY (user_id) REFERENCES root.users(id);


--
-- Name: photos_by_month photos_by_month_user_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.photos_by_month
    ADD CONSTRAINT photos_by_month_user_id_fkey FOREIGN KEY (user_id) REFERENCES root.users(id);


--
-- Name: users_access users_access_user_id_fkey; Type: FK CONSTRAINT; Schema: root; Owner: postgres
--

ALTER TABLE ONLY root.users_access
    ADD CONSTRAINT users_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES root.users(id);


--
-- PostgreSQL database dump complete
--

