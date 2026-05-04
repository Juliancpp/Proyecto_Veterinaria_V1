import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Users, PawPrint, Mail, Phone, MapPin } from "lucide-react";
import heroImg from "@/assets/Logo.jpg";
import dogSample1 from "@/assets/Perro1.jpg";
import dogSample2 from "@/assets/Perro2.jpg";
import dogSample3 from "@/assets/gato.jpg";

const stats = [
  { icon: PawPrint, value: "500+", label: "Mascotas adoptadas" },
  { icon: Users, value: "200+", label: "Familias felices" },
  { icon: Heart, value: "1000+", label: " perritos y gatitos desparasitados y vitaminizados gratuitamente" },
];

const stories = [
  {
    name: "Luna",
    image: dogSample1,
    text: "Luna fue rescatada de las calles y ahora disfruta de su hogar con la familia Pérez.",
  },
  {
    name: "Max",
    image: dogSample2,
    text: "Max encontró el amor en una familia que lo acepta tal como es. ¡Pura felicidad!",
  },
  {
    name: "Buddy",
    image: dogSample3,
    text: "Buddy pasó de estar en un refugio a ser el compañero inseparable de dos niños.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const HomePage = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Mascotas esperando un hogar" className="h-full w-full object-cover" />
          Por un amigo fiel<div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="section-container relative z-10 flex min-h-[85vh] flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl"
          >
            Dale un hogar a quien <br />
            <span className="gradient-text">más lo necesita</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg text-primary-foreground/80"
          >
            Miles de mascotas esperan una segunda oportunidad. Adopta, no compres.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link to="/adopt" className="btn-hero">
              Quiero Adoptar
            </Link>
            <Link
              to="/about"
              className="rounded-full border-2 border-primary-foreground/30 px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:border-primary-foreground hover:bg-primary-foreground/10"
            >
              Conocer más
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-container -mt-16 relative z-20">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="card-pet flex items-center gap-5 p-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="section-container py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Historias de <span className="gradient-text">Adopción</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Cada adopción es una historia de amor. Conoce a quienes ya encontraron su hogar.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {stories.map((story, i) => (
            <motion.div
              key={story.name}
              custom={i + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="card-pet group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground">{story.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{story.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-muted/50 py-24">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Contáctanos</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              ¿Tienes preguntas? Estamos aquí para ayudarte en cada paso del proceso de adopción.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Mail, title: "Email", detail: "porunamigofiel.pillaro@gmail.com" },
              { icon: Phone, title: "Teléfono", detail: "+593 98 718 1329" },
              { icon: MapPin, title: "Ubicación", detail: "Ambato, Ecuador" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center rounded-2xl bg-card p-8 text-center"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
