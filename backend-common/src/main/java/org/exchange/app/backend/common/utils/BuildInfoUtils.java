package org.exchange.app.backend.common.utils;

import java.util.Properties;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.common.api.model.BuildInfo;

@Log4j2
public class BuildInfoUtils {

  public static void showVersion() {
    BuildInfo buildInfo = prepareBuildInfo();
    log.info("Build name    : {}", buildInfo.getModuleName());
    log.info("Build version : {}", buildInfo.getVersionNumber());
    if (buildInfo.getBuildTime() != null) {
      log.info("Build time    : {}", buildInfo.getBuildTime());
    }
    log.info("Git commit    : {}", buildInfo.getCommitHash());
    log.info("Git branch    : {}", buildInfo.getBranchName());
    log.info("Commit time   : {}", buildInfo.getCommitTime());
  }

  public static BuildInfo prepareBuildInfo() {
    BuildInfo buildInfo = new BuildInfo();
    try {
      ClassLoader classLoader = BuildInfoUtils.class.getClassLoader();
      Properties properties = new Properties();
      properties.load(classLoader.getResourceAsStream("META-INF/git.properties"));
      buildInfo.setCommitHash(properties.get("git.commit.id.abbrev").toString());
      buildInfo.setBranchName(properties.get("git.branch").toString());
      buildInfo.setCommitTime(properties.get("git.commit.time").toString());

      properties.load(classLoader.getResourceAsStream("META-INF/build-info.properties"));
      buildInfo.setVersionNumber(properties.get("build.version").toString());
      buildInfo.setBuildTime(properties.get("build.time").toString());
      buildInfo.setModuleName(properties.get("build.name").toString());

    } catch (Exception e) {
      log.error(e);
    }
    return buildInfo;
  }
}
