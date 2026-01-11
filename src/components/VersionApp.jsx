const styles = {
  version: {
    textAlign: "center",
    fontSize: "9px",
  },
};

export default function VersionApp() {
  return (
    <p style={styles.version}>
      Version App : {import.meta.env.VITE_VERSION_APP}
    </p>
  );
}
