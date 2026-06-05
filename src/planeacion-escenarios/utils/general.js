export const scrollToSection = (id) => {
    document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth' });
}